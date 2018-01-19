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
	rawContentTags = /^(?:script|style|code)/,
	doubleString = /^"((?:[^"\\]|\\.)*)"/,
	singleString = /^'((?:[^'\\]|\\.)*)'/;

const rules = {
	document: r
		.zeroOrMore(r.space().one('comment'))
		.terminal(/^\s*<!DOCTYPE[^>]*>\s*/i)
		.one('fragment')
		.space(),

	comment: r.terminal(/^<!--([.\s\S\r]*?)(?=-->)-->/, (env, obj, cap) => {
		obj.nodeName = '#comment';
		obj.data = cap[1];
	}),

	// closing tag
	tagEnd: r.terminal(/^\s*<\/([\w-_\:]+)\s*>/, (env, obj, cap, startIndex) => {
		if (obj.nodeName !== cap[1]) {
			env.errors = env.errors || [];
			env.errors.push('tag badly closed : ' + cap[1] + ' - (at opening : ' + obj.nodeName + ')');
		} else if (env.options && env.options.location) {
			obj.endContentIndex = startIndex;
		}
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
		.terminal(/^<([\w-_:]+)\s*/, (env, obj, cap) => {
			obj.nodeName = cap[1];
		}) // start tag
		.one('attributes')
		.oneOf(
			// strict self closed tag			
			r.terminal(/^\/>/),

			r.char('>') // open tag or tag with children
			.done((env, obj, lastIndex) => {

				// check html5 unstrict self-closing tags
				if (openTags.test(obj.nodeName))
					return; // no children

				if (env.options && env.options.location) {
					obj.startContentIndex = lastIndex;
				}
				if (rawContentTags.test(obj.nodeName)) {
					// get inner script content
					obj.content = '';
					exec(env.parser.rules.innerScript, obj, env);
				} else
					// get inner tag content
					exec(env.parser.rules.fragment, obj, env);

				if (!env.error) // close tag
					exec(env.parser.rules.tagEnd, obj, env);
			}),
			r.error('Missing end of tag')
		),


	attributes: r.zeroOrMore({
		rule: r.oneOf('handlebars', 'attribute').space(),
		pushTo: (env, parent, descriptor) => {
			parent.attributes = parent.attributes || [];
			if (descriptor.name === 'class' && !descriptor.value)
				return;
			parent.attributes.push(descriptor);
		}
	}),

	attribute: r
		.terminal(/^([\w-_\.]+)\s*/, (env, obj, cap) => {
			obj.name = cap[1];
		})
		.maybeOne('attributeValue'),

	attributeValue: r
		.terminal(/^\s*=\s*/)
		.oneOf({
			rules: [
				r.terminal(doubleString, (env, obj, cap) => {
					obj.value = cap[1];
				}),
				r.terminal(singleString, (env, obj, cap) => {
					obj.value = cap[1];
				}),
				r.terminal(/^(\/(?!>)|[^\s\/])+/, (env, obj, cap) => {
					obj.value = cap[0];
					obj.directValue = true;
				}),
			]
		}),


	handlebars: r
		.terminal(/^({{{?[^}]+}}}?)\s*/, (env, obj, cap) => {
			obj.handlebars = true;
			obj.expression = cap[1];
		}),

	innerScript: r
		.zeroOrMore(r.oneOf('textWithoutQuotesOrTags', 'doublestring', 'singlestring', 'templatestring')),

	textWithoutQuotesOrTags: r
		.terminal(/^([^'"`<]|<(?!\/))+/, (env, obj, cap) => {
			if (obj.content)
				obj.content += cap[0];
			else
				obj.content = cap[0];
		}),

	doublestring: r.terminal(doubleString, (env, descriptor, cap) => descriptor.content += `"${ cap[1] }"`),

	singlestring: r.terminal(singleString, (env, descriptor, cap) => descriptor.content += `'${ cap[1] }'`),

	templatestring: r.terminal(/^`([^`]*)`/, (env, descriptor, cap) => descriptor.content += `\`${ cap[1] }\``)
};

const parser = new Parser(rules, 'fragment');

parser.parseDocument = function parseDoc(doc, options = {}) {
	return this.parse(doc, 'document', {}, {
		options
	});
};

parser.parseFragment = function parseFrag(doc, options = {}) {
	return this.parse(doc, 'fragment', {}, {
		options
	});
};

export default parser;
