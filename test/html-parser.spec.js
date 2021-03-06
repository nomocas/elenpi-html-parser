/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 *
 */

/* global describe, it */
import chai from 'chai';
import parser from '../src/index';

const expect = chai.expect;
chai.should();

describe("HTML5 parse", () => {

	describe("tag", () => {
		const res = parser.parse('<div></div>', 'tag');
		it("should", () => {
			expect(res).to.deep.equals({
				nodeName: "div"
			});
		});
	});

	describe("self closed tag", () => {
		const res = parser.parse('<div/>', 'tag');
		it("should", () => {
			expect(res).to.deep.equals({
				nodeName: "div"
			});
		});
	});

	describe("unstrict self-closing tag", () => {
		const res = parser.parse('<br>', 'tag');
		it("should", () => {
			expect(res).to.deep.equals({
				nodeName: "br"
			});
		});
	});

	describe("open tag", () => {
		const res = parser.parse('<meta>', 'tag');
		it("should", () => {
			expect(res).to.deep.equals({
				nodeName: "meta"
			});
		});
	});

	describe("textWithoutQuotesOrTags 1", () => {
		const res = parser.parse('ho', 'textWithoutQuotesOrTags');
		it("should", () => {
			expect(res).to.deep.equals({
				content: 'ho'
			});
		});
	});


	describe("textWithoutQuotesOrTags 2", () => {
		const res = parser.parse('ho < bar', 'textWithoutQuotesOrTags');
		it("should", () => {
			expect(res).to.deep.equals({
				content: 'ho < bar'
			});
		});
	});

	describe("textWithoutQuotesOrTags 3", () => {
		const res = parser.parse('ho<bar/>', 'fragment');
		it("should", () => {
			expect(res).to.deep.equals({
				childNodes: [{
					nodeName: "#text",
					value: "ho"
				}, {
					nodeName: "bar"
				}]
			});
		});
	});

	describe("textWithoutQuotesOrTags 4", () => {
		const res = parser.parse('<title>ho</title>', 'fragment');
		it("should", () => {
			expect(res).to.deep.equals({
				childNodes: [{
					childNodes: [{
						nodeName: "#text",
						value: "ho"
					}],
					nodeName: "title"
				}]
			});
		});
	});

	describe("open tag + closed just after", () => {
		const res = parser.parse('<meta><title>ho</title>', 'fragment');
		it("should", () => {
			expect(res).to.deep.equals({
				childNodes: [{
					nodeName: "meta"
				}, {
					childNodes: [{
						nodeName: '#text',
						value: "ho"
					}],
					nodeName: "title"
				}]
			});
		});
	});

	describe("tag badly closed will throw", () => {
		const parse = function() { parser.parse('<bars>hello</bar>', 'tag'); };
		it("should throw", () => {
			expect(parse).to.throw();
		});
	});


	describe("tag with text content", () => {
		const res = parser.parse('<div>hello</div>', 'tag');
		it("should", () => {
			expect(res).to.deep.equals({
				nodeName: "div",
				childNodes: [{
					nodeName: '#text',
					value: "hello"
				}]
			});
		});
	});

	describe("attribute (double quoted)", () => {
		const res = parser.parse('class="hello"', 'attribute');
		it("should", () => {
			expect(res).to.deep.equals({
				name: "class",
				value: "hello"
			});
		});
	});

	describe("attribute (single quoted)", () => {
		const res = parser.parse('class=\'hello\'', 'attribute');
		it("should", () => {
			expect(res).to.deep.equals({
				name: "class",
				value: "hello"
			});
		});
	});

	describe("attribute (directValue)", () => {
		const res = parser.parse('class=hello', 'attribute');
		it("should", () => {
			expect(res).to.deep.equals({
				name: "class",
				value: "hello",
				directValue: true
			});
		});
	});

	describe("tag (self-closed) with attribute (directValue) that touch the end of tag", () => {
		const res = parser.parse('<div class=hello/>', 'tag');
		it("should", () => {
			expect(res).to.deep.equals({
				nodeName: "div",
				attributes: [{
					name: "class",
					value: "hello",
					directValue: true
				}]
			});
		});
	});

	describe("attribute with directValue as path", () => {
		const res = parser.parse('class=./hello/foo', 'attribute');
		it("should", () => {
			expect(res).to.deep.equals({
				name: "class",
				value: "./hello/foo",
				directValue: true
			});
		});
	});

	describe("tag attribute with directValue as path", () => {
		const res = parser.parse('<div class=./hello/foo />', 'tag');
		it("should", () => {
			expect(res).to.deep.equals({
				nodeName: "div",
				attributes: [{
					name: "class",
					value: "./hello/foo",
					directValue: true
				}]
			});
		});
	});

	describe("attributes", () => {
		const res = parser.parse('class="hello" id=reu', 'attributes');
		it("should", () => {
			expect(res).to.deep.equals({
				attributes: [{
					name: "class",
					value: "hello"
				}, {
					name: "id",
					value: "reu",
					directValue: true
				}],
			});
		});
	});

	describe("tag with children", () => {
		const res = parser.parse('<div>hello <span>John</span></div>', 'tag');
		it("should", () => {
			expect(res).to.deep.equals({
				nodeName: "div",
				childNodes: [{
					nodeName: '#text',
					value: "hello "
				}, {
					nodeName: "span",
					childNodes: [{
						nodeName: '#text',
						value: "John"
					}]
				}]
			});
		});
	});

	describe("tag with children with new line and tab", () => {
		const res = parser.parse('<div>hello \n\t<span>John</span>\n</div>', 'tag');
		it("should", () => {
			expect(res).to.deep.equals({
				nodeName: "div",
				childNodes: [{
					nodeName: '#text',
					value: "hello \n\t"
				}, {
					nodeName: "span",
					childNodes: [{
						nodeName: '#text',
						value: "John"
					}]
				},
				{
					nodeName: "#text",
					value: "\n"
				}
				]
			});
		});
	});

	describe("tag with script", () => {
		const res = parser.parse('<div>hello <script>var a = 12 < 15;</script></div>', 'tag');
		it("should", () => {
			expect(res).to.deep.equals({
				nodeName: "div",
				childNodes: [{
					nodeName: '#text',
					value: "hello "
				}, {
					nodeName: "script",
					content: "var a = 12 < 15;"
				}]
			});
		});
	});

	describe("tag with script with new line", () => {
		const res = parser.parse('<div>hello <script>var a = 12 < 15;\nvar b = 0; </script></div>', 'tag');
		it("should", () => {
			expect(res).to.deep.equals({
				nodeName: "div",
				childNodes: [{
					nodeName: '#text',
					value: "hello "
				}, {
					nodeName: "script",
					content: "var a = 12 < 15;\nvar b = 0; "
				}]
			});
		});
	});

	describe("p tag", () => {
		const res = parser.parse('<p>hello</p>', 'tag');
		it("should", () => {
			expect(res).to.deep.equals({
				nodeName: "p",
				childNodes: [{
					nodeName: '#text',
					value: "hello"
				}]
			});
		});
	});

	describe("comment", () => {
		const res = parser.parse('<!-- bloupi -->', 'comment');
		it("should", () => {
			expect(res).to.deep.equals({
				nodeName: '#comment',
				data: " bloupi "
			});
		});
	});

	describe("comment with single quote", () => {
		const res = parser.parse("<!-- don't -->", 'comment');
		it("should", () => {
			expect(res).to.deep.equals({
				nodeName: '#comment',
				data: " don't "
			});
		});
	});

	describe("comment with new line", () => {
		const res = parser.parse('<!-- \rbloupi\n -->', 'comment');
		it("should", () => {
			expect(res).to.deep.equals({
				nodeName: '#comment',
				data: ' \rbloupi\n '
			});
		});
	});

	describe("comment with new line", () => {
		const res = parser.parse('<!-- should include critical CSS (https://github.com/addyosmani/critical) -->', 'comment');
		it("should", () => {
			expect(res).to.deep.equals({
				nodeName: '#comment',
				data: ' should include critical CSS (https://github.com/addyosmani/critical) '
			});
		});
	});

	describe("variable with handlebars syntax", () => {
		const res = parser.parse('<div {{ foo }}>bar</div>', 'tag');
		it("should", () => {
			expect(res).to.deep.equals({
				attributes: [{
					handlebars: true,
					expression: "{{ foo }}"
				}],
				childNodes: [{
					nodeName: "#text",
					value: "bar"
				}],
				nodeName: "div"
			});
		});
	});

	describe("variable with dot syntax", () => {
		const res = parser.parse('<div foo.bar>zoo</div>', 'tag');
		it("should", () => {
			expect(res).to.deep.equals({
				attributes: [{
					name: "foo.bar"
				}],
				childNodes: [{
					nodeName: "#text",
					value: "zoo"
				}],
				nodeName: "div"
			});
		});
	});


	describe("Scripts", () => {
		const doc2 = `<script>
		document.write('<script>bouh</script>');
		document.write('<script>"bouh\\'</script>');
		document.write("<script>bouh</script>");
		document.write("<script>'bouh\\"</script>");
		</script><script></script>`;
		const res = parser.parse(doc2, 'fragment');

		it("should", () => {
			expect(res).to.deep.equals({
				childNodes: [{
					nodeName: "script",
					content: "\n\t\tdocument.write('<script>bouh</script>');\n\t\tdocument.write('<script>\"bouh\\'</script>');\n\t\tdocument.write(\"<script>bouh</script>\");\n\t\tdocument.write(\"<script>'bouh\\\"</script>\");\n\t\t"
				},
				{
					nodeName: "script",
					content: ""
				}
				]
			});
		});
	});


	describe("Scripts with comment with unique single quote", () => {
		const doc2 = `<script>
		var a = 2; // this doesn't work
		</script>`;
		const res = parser.parse(doc2, 'fragment');

		it("should", () => {
			expect(res).to.deep.equals({
				childNodes: [{
					nodeName: "script",
					content: "\n\t\tvar a = 2; // this doesn't work\n\t\t"
				}
				]
			});
		});
	});

	describe("Scripts with tags and comment with unique single quote", () => {
		const doc2 = `<script>
		// we add it late because it's 150k to load
		var b = '<div></div>';
		</script>`;
		const res = parser.parse(doc2, 'fragment');

		it("should", () => {
			expect(res).to.deep.equals({
				childNodes: [{
					nodeName: "script",
					content: "\n\t\t// we add it late because it's 150k to load\n\t\tvar b = '<div></div>';\n\t\t"
				}
				]
			});
		});
	});


	describe("Style", () => {
		const doc2 = `<style>
			#fixture {
				position: absolute;
				top: -9999;
				left: -9999;
			}
		</style>`;
		const res = parser.parse(doc2, 'fragment');

		it("should", () => {
			expect(res).to.deep.equals({
				childNodes: [{
					nodeName: "style",
					content: "\n\t\t\t#fixture {\n\t\t\t\tposition: absolute;\n\t\t\t\ttop: -9999;\n\t\t\t\tleft: -9999;\n\t\t\t}\n\t\t"
				}]
			});
		});
	});

	describe("comment with nested comment", () => {
		const res = parser.parse(`
	<!-- hop --><template><!-- hip --></template>
`, 'fragment');

		it("should", () => {
			expect(res).to.deep.equals({
				childNodes: [{
					nodeName: '#text',
					value: '\n\t'
				},
				{
					nodeName: '#comment',
					data: ' hop '
				},
				{
					nodeName: 'template',
					childNodes: [{
						nodeName: '#comment',
						data: ' hip '
					}]
				},
				{
					nodeName: '#text',
					value: '\n'
				}
				]
			});
		});
	});

	describe("full line", () => {
		const text = '<div id="hello" class=reu >foo <br> <!-- hello \n--> <span class="blu" > bar </span></div><home /> hello <script type="text/javascript">var a = 12, \nb = a < 14;</script>';
		const res = parser.parse(text, 'fragment');

		it("should", () => {
			expect(res).to.deep.equals({
				childNodes: [{
					nodeName: "div",
					attributes: [{
						name: "id",
						value: "hello"
					}, {
						name: "class",
						value: "reu",
						directValue: true
					}],
					childNodes: [{
						nodeName: '#text',
						value: "foo "
					}, {
						nodeName: "br"
					}, {
						nodeName: "#text",
						value: " "
					}, {
						nodeName: '#comment',
						data: " hello \n"
					}, {
						nodeName: "#text",
						value: " "
					}, {
						nodeName: "span",
						attributes: [{
							name: "class",
							value: "blu"
						}],
						childNodes: [{
							nodeName: '#text',
							value: " bar "
						}]
					}]
				}, {
					nodeName: "home"
				}, {
					nodeName: '#text',
					value: " hello "
				}, {
					nodeName: "script",
					attributes: [{
						name: "type",
						value: "text/javascript"
					}],
					content: "var a = 12, \nb = a < 14;"
				}]
			});
		});
	});

	describe("fragment with style followed by script", () => {
		const doc = `<style></style><script>mocha.setup("bdd");</script>`;
		const res = parser.parse(doc, 'fragment');
		it("should", () => {
			expect(res).to.deep.equals({
				childNodes: [{
					content: "",
					nodeName: "style"
				}, {
					content: "mocha.setup(\"bdd\");",
					nodeName: "script"
				}]
			});
		});
	});

	describe("document", () => {
		// from elenpi/index.html (mocha tests index for browser)
		const doc = `<!DOCTYPE html>
<html>

	<head>
		<meta charset="utf-8">
		<title>elenpi mocha tests</title>
		<link rel="stylesheet" href="./test/mocha.css" />
		<style>
			#fixture {
				position: absolute;
				top: -9999;
				left: -9999;
			}
		</style>
		<script type="text/javascript" src="./index.js"></script>
		<script src="./test/chai.js"></script>
		<script src="./test/mocha.js"></script>
		<script>
			mocha.setup("bdd");
		</script>
		<script src="./test/test.js"></script>
		<script>
			window.onload = function() {
				mocha.run()
			};
		</script>
	</head>

	<body>
		<h2 style="margin-left:30px;"><a href="https://github.com/nomocas/elenpi">elenpi</a> tests</h2>
		<div id="mocha"></div>
	</body>
</html>`;

		const res = parser.parse(doc, 'document');

		it("should", () => {
			expect(res).to.deep.equals({
				childNodes: [{
					nodeName: "html",
					childNodes: [{
						nodeName: "#text",
						value: "\n\n\t"
					},
					{
						nodeName: "head",
						childNodes: [{
							nodeName: "#text",
							value: "\n\t\t"
						},
						{
							nodeName: "meta",
							attributes: [{
								name: "charset",
								value: "utf-8"
							}]
						},
						{
							nodeName: "#text",
							value: "\n\t\t"
						},
						{
							nodeName: "title",
							childNodes: [{
								nodeName: "#text",
								value: "elenpi mocha tests"
							}]
						},
						{
							nodeName: "#text",
							value: "\n\t\t"
						},
						{
							nodeName: "link",
							attributes: [{
								name: "rel",
								value: "stylesheet"
							},
							{
								name: "href",
								value: "./test/mocha.css"
							}
							]
						},
						{
							nodeName: "#text",
							value: "\n\t\t"
						},
						{
							nodeName: "style",
							content: "\n\t\t\t#fixture {\n\t\t\t\tposition: absolute;\n\t\t\t\ttop: -9999;\n\t\t\t\tleft: -9999;\n\t\t\t}\n\t\t"
						},
						{
							nodeName: "#text",
							value: "\n\t\t"
						},
						{
							nodeName: "script",
							attributes: [{
								name: "type",
								value: "text/javascript"
							},
							{
								name: "src",
								value: "./index.js"
							}
							],
							content: ""
						},
						{
							nodeName: "#text",
							value: "\n\t\t"
						},
						{
							nodeName: "script",
							attributes: [{
								name: "src",
								value: "./test/chai.js"
							}],
							content: ""
						},
						{
							nodeName: "#text",
							value: "\n\t\t"
						},
						{
							nodeName: "script",
							attributes: [{
								name: "src",
								value: "./test/mocha.js"
							}],
							content: ""
						},
						{
							nodeName: "#text",
							value: "\n\t\t"
						},
						{
							nodeName: "script",
							content: "\n\t\t\tmocha.setup(\"bdd\");\n\t\t"
						},
						{
							nodeName: "#text",
							value: "\n\t\t"
						},
						{
							nodeName: "script",
							attributes: [{
								name: "src",
								value: "./test/test.js"
							}],
							content: ""
						},
						{
							nodeName: "#text",
							value: "\n\t\t"
						},
						{
							nodeName: "script",
							content: "\n\t\t\twindow.onload = function() {\n\t\t\t\tmocha.run()\n\t\t\t};\n\t\t"
						},
						{
							nodeName: "#text",
							value: "\n\t"
						}
						]
					},
					{
						nodeName: "#text",
						value: "\n\n\t"
					},
					{
						nodeName: "body",
						childNodes: [{
							nodeName: "#text",
							value: "\n\t\t"
						},
						{
							nodeName: "h2",
							attributes: [{
								name: "style",
								value: "margin-left:30px;"
							}],
							childNodes: [{
								nodeName: "a",
								attributes: [{
									name: "href",
									value: "https://github.com/nomocas/elenpi"
								}],
								childNodes: [{
									nodeName: "#text",
									value: "elenpi"
								}]
							},
							{
								nodeName: "#text",
								value: " tests"
							}
							]
						},
						{
							nodeName: "#text",
							value: "\n\t\t"
						},
						{
							nodeName: "div",
							attributes: [{
								name: "id",
								value: "mocha"
							}]
						},
						{
							nodeName: "#text",
							value: "\n\t"
						}
						]
					},
					{
						nodeName: "#text",
						value: "\n"
					}
					]
				}]
			});
		});
	});
});
