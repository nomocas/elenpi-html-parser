/** 
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 * html tokenizer
 */

 /* eslint no-console:0 */
import elenpi from 'elenpi';

const r = elenpi.Rule.initializer,
	Parser = elenpi.Parser,
	exec = Parser.exec,
	openTags = /^(br|input|area|base|col|command|embed|hr|img|link|meta|param|source|track|wbr)/,
	onlySpace = /^\s+$/,
	rawContentTags = /^(?:script|style|code)/;

const rules = {
	document: r
		.zeroOrMore(r.space().one('comment'))
		.terminal(/^\s*<!DOCTYPE[^>]*>\s*/i)
		.one('children')
		.space(),

	comment: r.terminal(/^<!--([\s\S]*)?(?=-->)-->/, (env, obj, cap) => obj.comment = cap[1]),

	// closing tag
	tagEnd: r.terminal(/^\s*<\/([\w-_\:]+)\s*>/, (env, obj, cap, startIndex) => {
		if (obj.tagName !== cap[1]) {
			env.errors = env.errors || [];
			env.errors.push('tag badly closed : ' + cap[1] + ' - (at opening : ' + obj.tagName + ')');
		} else if (env.options && env.options.location && rawContentTags.test(obj.tagName))
			obj.endContentIndex = startIndex;
	}),

	// tag children (or Fragment)
	children: r
		.zeroOrMore({
			pushTo: 'children',
			rule: r.oneOf('comment', 'text', 'tag')
		}),

	text: r.terminal(/^[^<]+/, (env, obj, cap) => {
		const val = cap[0];
		if (onlySpace.test(val))
			obj.skip = true;
		else
			obj.textValue = val;
	}),

	// normal tag (including raw tags)
	tag: r
		.terminal(/^<([\w-_\:]+)\s*/, (env, obj, cap) => obj.tagName = cap[1]) // start tag
		.zeroOrMore('attributes')
		.oneOf(
			r.char('>') // open tag or tag with children
			.done((env, obj, lastIndex) => {

				// check html5 unstrict self-closing tags
				if (openTags.test(obj.tagName))
					return; // no children


				if (rawContentTags.test(obj.tagName)) {
					// get inner script content
					obj.content = '';
					if (env.options && env.options.location)
						obj.startContentIndex = lastIndex;
					exec(env.parser.rules.innerScript, obj, env);
				} else
					// get inner tag content
					exec(env.parser.rules.children, obj, env);

				if (!env.error) // close tag
					exec(env.parser.rules.tagEnd, obj, env);
			}),
			// strict self closed tag
			r.terminal(/^\/>/),
			r.error('Missing end of tag')
		),

	// attrName | attrName="... ..." | attrName=something | attrName={{ .. }} | attrName={ .. }
	// with an optional space (\s*) after equal sign (if any).
	attributes: r
		.terminal(/^([\w-_]+)\s*(?:=\s*("([^"]*)"|[\w-_]+))?\s*/, (env, obj, cap) => {
			const attrName = cap[1],
				value = (cap[3] !== undefined) ? cap[3] : ((cap[2] !== undefined) ? cap[2] : '');

			if (attrName !== 'class') {
				obj.attributes = obj.attributes || {};
				obj.attributes[attrName] = value;
			} else if (value)
				obj.classes = value.split(/\s+/);
		}),

	innerScript: r
		.zeroOrMore(r.oneOf('textWithoutQuotesOrTags', 'doublestring', 'singlestring', 'templatestring')),

	textWithoutQuotesOrTags: r
		.terminal(/^(?:[^'"`<]|<[^\/])+/, (env, obj, cap) => obj.content += cap[0]),

	doublestring: r.terminal(/^"((?:[^"\\]|\\.)*)"/, (env, descriptor, cap) => descriptor.content += `"${ cap[1] }"`),

	singlestring: r.terminal(/^'((?:[^'\\]|\\.)*)'/, (env, descriptor, cap) => descriptor.content += `'${ cap[1] }'`),

	templatestring: r.terminal(/^`([^`]*)`/, (env, descriptor, cap) => descriptor.content += `\`${ cap[1] }\``)
};

const parser = new Parser(rules, 'children');

parser.parseDocument = function parseDoc(doc, opts = {}) {
	return this.parse(doc, 'document', null, {
		options: opts
	});
};

parser.parseFragment = function parseFrag(doc, opts = {}) {
	return this.parse(doc, 'children', null, {
		options: opts
	});
};

export default parser;
