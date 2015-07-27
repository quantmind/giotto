'''Lux application for building giottojs.org
'''
import os

DESCRIPTION = ('GiottoJS is a javascript visualization library built on '
               'top of d3js. '
               'It is designed to visualize both SVG and Canvas elements '
               'with a simple API. AngularJS integration')

SITE_URL = 'http://giottojs.org'
HTML_TITLE = 'GiottoJs Examples'
STATIC_LOCATION = '../docs/giotto'
CMS_PARTIALS_PATH = 'giottoweb/content/context'
FAVICON = 'giottoweb/favicon.ico'
MEDIA_URL = '/media/'
EXTENSIONS = ['lux.extensions.base',
              'lux.extensions.ui',
              'lux.extensions.code',
              'lux.extensions.angular',
              'lux.extensions.sitemap',
              'lux.extensions.content',
              'lux.extensions.static',
              'lux.extensions.oauth',
              'lux.extensions.code',
              'giottoweb.giotto']

HTML_LINKS = ['https://cdnjs.cloudflare.com/ajax/libs/font-awesome/'
              '4.3.0/css/font-awesome.min.css',
              {'href': 'giottoweb/light', 'id': 'giotto-theme'}]
SCRIPTS = ['giottoweb/giottoweb']

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

REPO = os.path.dirname(os.path.dirname(__file__))

bind = ':9060'
workers = 0


from os import path

import lux
from lux.extensions.content import Content, CMS

from .ui import add_css


meta_default = {'image': '${MEDIA_URL}giottoweb/giotto.png',
                'twitter:card': 'summary_large_image',
                'template': 'partials/base.html'}

examples_meta = {'template': 'partials/examples.html',
                 'twitter:card': 'summary_large_image'}


class Extension(lux.Extension):

    def middleware(self, app):
        media_url = app.config['MEDIA_URL']
        site = Content('site', REPO, path='content/site', url='')
        api = Content('api', REPO, path='content/api', url='api')
        examples = Content('examples', REPO, path='content/examples',
                           url='examples')
        app.cms = CMS(app)
        app.cms.add_router(Content('examples', REPO, path='content/examples',
                                   content_meta=examples_meta,
                                   url='examples'))
        app.cms.add_router(Content('api', REPO, path='content/api',
                                   url='api'))
        app.cms.add_router(Content('site', REPO, path='content/site',
                                   content_meta=meta_default,
                                   url=''))
        return app.middleware()

    def on_html_document(self, app, request, doc):
        doc.head.embedded_js.append('var gexamples = {}, giottoQueue = [];\n')
        doc.attr('ng-controller', 'GiottoExample')
