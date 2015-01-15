'''Lux application for building giottojs.org
'''
DESCRIPTION = ('GiottoJS is a javascript visualization library built on '
               'top of d3js. '
               'It is designed to visualize both SVG and Canvas elements '
               'with a simple API. AngularJS integration')

SITE_URL = 'http://giottojs.org'
HTML_TITLE = 'GiottoJs Examples'
STATIC_LOCATION = '../docs/giotto'
CONTEXT_LOCATION = 'giottoweb/content/context'
FAVICON = 'giottoweb/favicon.ico'
MEDIA_URL = '/media/'
ANGULAR_UI_ROUTER = True
STATIC_API = 'ng'
MINIFIED_MEDIA = True
EXTENSIONS = ['lux.extensions.base',
              'lux.extensions.ui',
              'lux.extensions.code',
              'lux.extensions.angular',
              'lux.extensions.static',
              'lux.extensions.sitemap',
              'lux.extensions.oauth',
              'lux.extensions.code',
              'giottoweb.giotto']
HTML_LINKS = ['giotto/giotto.css',
              'giottoweb/giottoweb.css']
REQUIREJS = ['.giottoweb/giottoweb.js']

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


from os import path

import lux
from lux.extensions.static import (HtmlContent, MediaBuilder, Sitemap,
                                   DirContent, Blog)
from .ui import add_css


meta_default = {'image': '$site_url$site_media/giottoweb/giotto.png',
                'twitter:card': 'summary_large_image',
                'template': 'partials/base.html'}

example_list_meta = {'title': 'GiottoJS Examples',
                     'description': 'A list of GiottoJS examples'}
examples_meta = {'template': 'partials/examples.html',
                 'twitter:card': 'summary_large_image'}


class Extension(lux.Extension):

    def middleware(self, app):
        media_url = app.config['MEDIA_URL']
        examples = HtmlContent('/',
                               Sitemap('/sitemap.xml'),
                               Blog('/examples',
                                    meta=example_list_meta,
                                    meta_children=examples_meta,
                                    content=DirContent,
                                    dir='examples',
                                    drafts=False,
                                    uirouter=False,
                                    index_template='partials/blogindex.html'),
                               HtmlContent('/api',
                                           dir='giottoweb/content/api',
                                           drafts=False,
                                           meta=meta_default),
                               drafts=False,
                               uirouter=False,
                               dir='giottoweb/content/site',
                               meta=meta_default)
        dist = MediaBuilder(media_url+'giotto', 'dist', lux=False)
        data = MediaBuilder('data', 'giottoweb/content/data', lux=False)
        return [dist, data, examples]

    def on_html_document(self, app, request, doc):
        doc.head.embedded_js.append('var gexamples = {}, giottoQueue = [];\n')

