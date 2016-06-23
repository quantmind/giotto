"""Lux application for building giottojs.org

To compile::

    pip3 install -r requirements.txt
    python3 manage.py static
"""
import os

from pulsar.apps.wsgi import MediaRouter

from lux.core import LuxExtension


DESCRIPTION = ('GiottoJS is a javascript visualization library built on '
               'top of d3js. '
               'It is designed to visualize both SVG and Canvas elements '
               'with a simple API. AngularJS integration')

CONTENT_REPO = os.path.dirname(__file__)
API_URL = '/api'
APP_NAME = 'GiottoJs'
HTML_TITLE = 'GiottoJs Examples'
DEFAULT_CONTENT_TYPE = 'text/html'
SERVE_STATIC_FILES = os.path.join(CONTENT_REPO, 'media')
FAVICON = 'giottojs/favicon.ico'
EXTENSIONS = ['lux.extensions.base',
              'lux.extensions.sitemap',
              'lux.extensions.rest',
              'lux.extensions.content']

CONTENT_GROUPS = {
    "site": {
        "path": "*",
        "meta": {
            "priority": 1
        }
    },
    "examples": {
        "path": "examples",
        "template": "partials/examples.html",
        "meta": {
            "priority": 1
        }
    },
    "context": {}
}

HTML_LINKS = ['https://cdnjs.cloudflare.com/ajax/libs/font-awesome/'
              '4.3.0/css/font-awesome.min.css',
              {'href': 'giottojs/sandstone', 'id': 'giotto-theme'}]
HTML_SCRIPTS = ['giottojs/giottojs']

HTML_META = [{'http-equiv': 'X-UA-Compatible',
              'content': 'IE=edge'},
             {'name': 'viewport',
              'content': 'width=device-width, initial-scale=1'},
             {'name': 'description', 'content': DESCRIPTION}]

LINKS = {'AngularJS': 'https://angularjs.org/',
         'RequireJS': 'http://requirejs.org/',
         'd3': 'http://d3js.org/',
         'd3js': 'http://d3js.org/'}

OAUTH_PROVIDERS = {'google': {'analytics': {'id': 'UA-54439804-4'}},
                   'twitter': {'site': '@quantmind'}}


class Extension(LuxExtension):

    def middleware(self, app):
        yield MediaRouter('/', CONTENT_REPO,
                          serve_only=('json', 'png', 'jpeg', 'txt'))
