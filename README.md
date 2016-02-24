<a href="http://giottojs.org">
<img src="https://assets.quantmind.com/giotto/giotto-banner.svg" width="400px" alt="GiottoJS">
</a>

D3 based visualization library.

**The master branch is currently under active development and not ready for anything useful. It is a complete rewrite using d3 v 4 as dependency.** For the original code, which still runs on http://giottojs.org, check the [2015 branch](https://github.com/quantmind/giotto/tree/2015).

[![Build Status](https://travis-ci.org/quantmind/giotto.svg?branch=master)](https://travis-ci.org/quantmind/giotto)
[![Coverage Status](https://img.shields.io/coveralls/quantmind/giotto.svg)](https://coveralls.io/r/quantmind/giotto?branch=master)
[![Dependency Status](https://david-dm.org/quantmind/giotto.svg)](https://david-dm.org/quantmind/giotto)
[![devDependency Status](https://david-dm.org/quantmind/giotto/dev-status.svg)](https://david-dm.org/quantmind/giotto#info=devDependencies)

# Giotto Library

To build and test the library, you need to install [node](https://nodejs.org/).
To install dependencies for the build, inside the distribution directory issue:
```
npm install
```
To run tests and build the bundle:
```
npm test
```

# GiottoJs

To build giottojs.org web site you need python 3.5. Once installed
```
pip install -r requirements.txt
```

# Acknowledgement

This library is built on top of several [d3](https://github.com/d3) libraries
as the [dev dependencies](https://david-dm.org/quantmind/giotto#info=devDependencies)
shows. All these libraries are BSD licensed

> Copyright (c) 2010-2015, Michael Bostock
> All rights reserved.

