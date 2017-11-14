# ES6 module boilerplate with full ES6 test suits and coverage

[![Travis branch](https://img.shields.io/travis/nomocas/es6-rb-mc-k-i-boilerplate/master.svg)](https://travis-ci.org/nomocas/es6-rb-mc-k-i-boilerplate)
[![bitHound Overall Score](https://www.bithound.io/github/nomocas/es6-rb-mc-k-i-boilerplate/badges/score.svg)](https://www.bithound.io/github/nomocas/es6-rb-mc-k-i-boilerplate)
[![bitHound Dependencies](https://www.bithound.io/github/nomocas/es6-rb-mc-k-i-boilerplate/badges/dependencies.svg)](https://www.bithound.io/github/nomocas/es6-rb-mc-k-i-boilerplate/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/nomocas/es6-rb-mc-k-i-boilerplate/badges/devDependencies.svg)](https://www.bithound.io/github/nomocas/es6-rb-mc-k-i-boilerplate/master/dependencies/npm)
[![licence](https://img.shields.io/npm/l/es6-rb-mc-k-i-boilerplate.svg)](https://spdx.org/licenses/MIT)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

- ES6 sources
- transpiled with [babel](https://babeljs.io) (to dist/es5/*)
- bundled with [rollup](https://github.com/rollup/rollup) (to dist/bundles/*)
- ES6 tests with [mocha](https://mochajs.org) and [chai](http://chaijs.com/) (runned directly from es6 with [babel-register](https://babeljs.io/docs/usage/babel-register/))
- [karma](http://karma-runner.github.io) runner with on-the-fly rollup/babel bundling
- Code coverage with [istanbul](https://istanbul.js.org/) and [nyc](https://github.com/istanbuljs/nyc) directly from ES6 tests and sources (no bundle)
- [coveralls](https://coveralls.io) reporting
- [standard-version](https://github.com/conventional-changelog/standard-version) for semver management and Changelog.md generation.
- [travis.ci](https://travis-ci.org/) config file
- [esdoc](https://esdoc.org) config file
- [eslint](http://eslint.org) ES6 base config for src and test
- [husky](https://github.com/typicode/husky) easy git hooks with already define precommit, prepush and commitmsg hook
- [validate-commit-msg](https://github.com/kentcdodds/validate-commit-msg) : commit message format precommit validation
- [commitizen](https://github.com/commitizen/cz-cli): commit message generation tools

## Usage

clone this repo then :

```
> npm i 
```

or

```
> yarn
```

then :

- build : `> npm run build`
- test :  `> npm test`
- karma : `> npm run karma`
- cover : `> npm run cover`
- coveralls reporting : `> npm run coveralls` (don't forget to add your .coveralls.yml with your api_key)
- es5-watch : `> npm run es5-watch`
- bundles-watch : `> npm run bundles-watch`
- sem-ver and changelog generation : `> npm run release`
- commitizen : `> npm run cmtz`
- hand validation of commit messages : `> npm run commitmsg`

## Produced outputs

- dist/es5/* : commonjs unbundled files (transpiled with babel)
- dist/bundles/index.js : cjs module
- dist/bundles/index.min.js : cjs module minified with uglifyjs
- dist/bundles/index.mjs : ES module

## For coveralls 

Travis is configured to run coveralls by default.

So either you remove coveralls run in travis config file, or add a .coveralls.yml with your "repo_token: ......" before pushing to travis (after a first manual `npm run coveralls`).

## For Commit Message Validation

Format is based on [angular spec](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit) which has become `conventional commit` (https://github.com/commitizen/cz-conventional-changelog)

## Licence

The [MIT](http://opensource.org/licenses/MIT) License

Copyright 2017 (c) Gilles Coomans

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
