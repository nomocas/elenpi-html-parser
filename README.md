# elenpi-html-parser

[![Travis branch](https://img.shields.io/travis/nomocas/elenpi-html-parser/master.svg)](https://travis-ci.org/nomocas/elenpi-html-parser)
[![bitHound Overall Score](https://www.bithound.io/github/nomocas/elenpi-html-parser/badges/score.svg)](https://www.bithound.io/github/nomocas/elenpi-html-parser)
[![bitHound Dependencies](https://www.bithound.io/github/nomocas/elenpi-html-parser/badges/dependencies.svg)](https://www.bithound.io/github/nomocas/elenpi-html-parser/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/nomocas/elenpi-html-parser/badges/devDependencies.svg)](https://www.bithound.io/github/nomocas/elenpi-html-parser/master/dependencies/npm)
[![licence](https://img.shields.io/npm/l/elenpi-html-parser.svg)](https://spdx.org/licenses/MIT)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

The simplest, lightest, most understandable and tweakable HTML5 parser.

Not the fastest but quite fast as well.

Work browser side and server side.

## Usage


```shell
npm i elenpi-html-parser --save
```

```javascript
const parser = require('elenpi-html-parser');

const fragmentAst = parser.parseFragment('<div class="foo">hello world</div>');

const docAST = parser.parseFragment(`
<!doctype html>
<html>
<head>
    <title>The page Title</title>
</head>
<body>
    <div class="foo">hello world</div>
</body>
</html>`);


const util = require('util');
console.log('docAST:', util.inspect(docAST, true, 10, true))

```

## Licence

The [MIT](http://opensource.org/licenses/MIT) License

Copyright 2017 (c) Gilles Coomans

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
