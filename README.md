# Giotto JS

D3 base visualization library.

http://giottojs.org

<a href="https://travis-ci.org/quantmind/giotto" target="_self">
<img src="https://travis-ci.org/quantmind/giotto.svg?branch=master" alt="giotto CI"></a>
[![Coverage Status](https://img.shields.io/coveralls/quantmind/giotto.svg)](https://coveralls.io/r/quantmind/giotto?branch=master)


# Giotto Web

To build giotto web you need to install lux, a python package for web applications:

    pip install lux

To build the static web site:

    python manage.py build_static

To build the static web during for development:

    python manage.py build_static --relative-url

To run the developemnt server:

    python manage.py serve


## Credits

* The ``giotto.slider`` component was created from [d3.slider](https://github.com/turban/d3.slider) in Jan 2015
