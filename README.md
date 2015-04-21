# Giotto JS

D3 base visualization library.

http://giottojs.org

<a href="https://travis-ci.org/quantmind/giotto" target="_self">
<img src="https://travis-ci.org/quantmind/giotto.svg?branch=master" alt="giotto CI"></a>
[![Coverage Status](https://img.shields.io/coveralls/quantmind/giotto.svg)](https://coveralls.io/r/quantmind/giotto?branch=master)

# Giotto Library

To build and test the library, you need to install [node](https://nodejs.org/), [gruntjs](http://gruntjs.com/) and
[bower](http://bower.io/):
```
npm install -g grunt-cli
npm install -g bower
```

To install dependencies for the build, inside the distribution directory issue:
```
npm install
brew install
```
Compilation, tests with grunt:
```
grunt build
grunt jasmine
```

# Giotto Web

To build giotto web you need to install lux, a python package for web applications:

    pip install -U -r requirements.txt

To build the static web site:

    python manage.py build_static

To build the static web during for development:

    python manage.py build_static --relative-url

To run the developemnt server:

    python manage.py serve


## Credits

* The ``giotto.slider`` component was created from [d3.slider](https://github.com/turban/d3.slider) in Jan 2015
