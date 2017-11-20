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
	rawContentTags = /^(?:script|style|code)/;

const rules = {
	document: r
		.zeroOrMore(r.space().one('comment'))
		.terminal(/^\s*<!DOCTYPE[^>]*>\s*/i)
		.one('fragment')
		.space(),

	comment: r.terminal(/^<!--([\s\S]*)?(?=-->)-->/, (env, obj, cap) => {
		obj.nodeName = '#comment';
		obj.data = cap[1];
	}),

	// closing tag
	tagEnd: r.terminal(/^\s*<\/([\w-_\:]+)\s*>/, (env, obj, cap, startIndex) => {
		if (obj.nodeName !== cap[1]) {
			env.errors = env.errors || [];
			env.errors.push('tag badly closed : ' + cap[1] + ' - (at opening : ' + obj.nodeName + ')');
		} else if (env.options && env.options.location && rawContentTags.test(obj.nodeName))
			obj.endContentIndex = startIndex;
	}),

	// fragment (or children)
	fragment: r
		.zeroOrMore({
			pushTo: 'childNodes',
			rule: r.oneOf('comment', 'text', 'tag')
		}),

	text: r.terminal(/^[^<]+/, (env, obj, cap) => {
		obj.nodeName = '#text';
		obj.value = cap[0];
	}),

	// normal tag (including raw tags)
	tag: r
		.terminal(/^<([\w-_:]+)\s*/, (env, obj, cap) => obj.nodeName = cap[1]) // start tag
		.zeroOrMore('attribute')
		.oneOf(
			r.char('>') // open tag or tag with children
			.done((env, obj, lastIndex) => {

				// check html5 unstrict self-closing tags
				if (openTags.test(obj.nodeName))
					return; // no children

				if (rawContentTags.test(obj.nodeName)) {
					// get inner script content
					obj.content = '';
					if (env.options && env.options.location)
						obj.startContentIndex = lastIndex;
					exec(env.parser.rules.innerScript, obj, env);
				} else
					// get inner tag content
					exec(env.parser.rules.fragment, obj, env);

				if (!env.error) // close tag
					exec(env.parser.rules.tagEnd, obj, env);
			}),
			// strict self closed tag
			r.terminal(/^\/>/),
			r.error('Missing end of tag')
		),

	// attrName | attrName="... ..." | attrName=something | attrName={{ .. }} | attrName={ .. }
	// with an optional space (\s*) after equal sign (if any).
	attribute: r
		.terminal(/^([\w-_]+)\s*(?:=\s*("([^"]*)"|[\w-_]+))?\s*/, (env, obj, cap) => {
			const attrName = cap[1],
				value = (cap[3] !== undefined) ? cap[3] : ((cap[2] !== undefined) ? cap[2] : '');
			obj.attributes = obj.attributes || {};
			if (attrName !== 'class' || value)
				obj.attributes[attrName] = value;
		}),

	innerScript: r
		.zeroOrMore(r.oneOf('textWithoutQuotesOrTags', 'doublestring', 'singlestring', 'templatestring')),

	textWithoutQuotesOrTags: r
		.terminal(/^(?:[^'"`<]|<[^\/])+/, (env, obj, cap) => obj.content += cap[0]),

	doublestring: r.terminal(/^"((?:[^"\\]|\\.)*)"/, (env, descriptor, cap) => descriptor.content += `"${ cap[1] }"`),

	singlestring: r.terminal(/^'((?:[^'\\]|\\.)*)'/, (env, descriptor, cap) => descriptor.content += `'${ cap[1] }'`),

	templatestring: r.terminal(/^`([^`]*)`/, (env, descriptor, cap) => descriptor.content += `\`${ cap[1] }\``)
};

const parser = new Parser(rules, 'fragment');

parser.parseDocument = function parseDoc(doc, options = {}) {
	return this.parse(doc, 'document', {}, { options });
};

parser.parseFragment = function parseFrag(doc, options = {}) {
	return this.parse(doc, 'fragment', {}, { options });
};

export default parser;
