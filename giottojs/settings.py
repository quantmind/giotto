import os

DESCRIPTION = ('GiottoJS is a javascript visualization library built on '
               'top of d3js. '
               'It is designed to visualize both SVG and Canvas elements '
               'with a simple API. AngularJS integration')

SITE_URL = 'http://giottojs.org'

HTML_TITLE = 'GiottoJs Examples'
DEFAULT_CONTENT_TYPE = 'text/html'
SERVE_STATIC_FILES = True
FAVICON = 'giottojs/favicon.ico'
EXTENSIONS = ['lux.extensions.base',
              'lux.extensions.ui',
              'lux.extensions.code',
              'lux.extensions.angular',
              'lux.extensions.sitemap',
              'lux.extensions.rest',
              'lux.extensions.content',
              'lux.extensions.oauth']

HTML_LINKS = ['https://cdnjs.cloudflare.com/ajax/libs/font-awesome/'
              '4.3.0/css/font-awesome.min.css',
              {'href': 'giottoweb/light', 'id': 'giotto-theme'}]
SCRIPTS = ['giottojs/giottojs']

HTML_META = [{'http-equiv': 'X-UA-Compatible',
              'content': 'IE=edge'},
             {'name': 'viewport',
              'content': 'width=device-width, initial-scale=1'},
             {'name': 'description', 'content': DESCRIPTION}]

LINKS = {'AngularJS': 'https://angularjs.org/',
         'RequireJS': 'http://requirejs.org/',
         'd3': 'http://d3js.org/',
         'd3js': 'http://d3js.org/'}

CONTENT_REPOSITORY = os.path.join(os.path.dirname(__file__))
CMS_PARTIALS_PATH = os.path.join(CONTENT_REPOSITORY, 'context')

bind = ':4020'
