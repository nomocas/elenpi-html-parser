/* eslint no-console:0 */
const parser = require('./dist/bundles/index');
const util = require('util');

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
		<script>
			document.write('<script>bouh</script>');
		</script>
	</head>

	<body>
		<h2 style="margin-left:30px;"><a href="https://github.com/nomocas/elenpi">elenpi</a> tests</h2>
		<div id="mocha"></div>
	</body>
</html>`;

const doc2 = `<script>
		document.write('<script>bouh</script>');
		document.write('<script>"bouh\\'</script>');
		document.write("<script>bouh</script>");
		document.write("<script>'bouh\\"</script>");
		</script><script></script>`;


const doc3 = '<script>hello world</script>';

const doc4 = `
<script>hello world</script>
`;

// console.log('doc3 trimed |%s|', doc3.substring(8, 19));
// console.log('doc4 trimed |%s|', doc4.substring(9, 20));

// const res = parser.parse(doc, 'document');
const res2 = parser.parse(doc2, 'children');
// const res = parser.parse(doc3, 'children');
// const res = parser.parse(doc4, 'children');

// console.log('res', util.inspect(res, true, 7, true));
// console.log('res2', util.inspect(res2, true, 7, true));
console.log('res2', JSON.stringify(res2, null, ' '));
