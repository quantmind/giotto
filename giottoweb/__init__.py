'''Lux application for building giottojs.org
'''
import os

from pulsar.utils.httpurl import remove_double_slash
from pulsar.utils.string import to_string
from pulsar.apps.wsgi import MediaRouter

import lux
from lux.extensions.content import Content, TextCMS, CMS

from .ui import add_css


DESCRIPTION = ('GiottoJS is a javascript visualization library built on '
               'top of d3js. '
               'It is designed to visualize both SVG and Canvas elements '
               'with a simple API. AngularJS integration')

SITE_URL = 'http://giottojs.org'

HTML_TITLE = 'GiottoJs Examples'
SERVE_STATIC_FILES = True
STATIC_LOCATION = '../docs/giotto'
REPO = os.path.dirname(os.path.dirname(__file__))
CMS_PARTIALS_PATH = os.path.join(REPO, 'content', 'context')
FAVICON = 'giottoweb/favicon.ico'
EXTENSIONS = ['lux.extensions.base',
              'lux.extensions.ui',
              'lux.extensions.code',
              'lux.extensions.angular',
              'lux.extensions.sitemap',
              'lux.extensions.content',
              #'lux.extensions.static',
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

bind = ':9060'
workers = 0


meta_default = {'image': '${MEDIA_URL}giottoweb/giotto.png',
                'twitter:card': 'summary_large_image',
                'template': 'partials/base.html'}

examples_meta = {'template': 'partials/examples.html',
                 'twitter:card': 'summary_large_image'}


class Example(TextCMS):

    @lux.cached
    def context(self, request):
        path = remove_double_slash('%s/script.js' % request.urlargs['path'])
        script = to_string(self.render_file(request, path))
        mkdown = '\n'.join(('```javascript', script, '```'))
        reader = lux.get_reader(request.app, 'script.md')
        content = reader.process(mkdown, 'script')
        return dict(script_js=script,
                    html_script_js=content.html(request))


class Extension(lux.Extension):

    def middleware(self, app):
        join = os.path.join
        middleware = [MediaRouter('data', join(REPO, 'content', 'data')),
                      MediaRouter('giotto', join(REPO, 'dist')),
                      MediaRouter('vendor', join(REPO, 'vendor'))]
        app.cms = CMS(app)
        app.cms.add_router(Example(Content('examples', REPO,
                                           path='content/examples',
                                           content_meta=examples_meta,
                                           url='examples')))
        app.cms.add_router(Content('api', REPO, path='content/api',
                                   url='api'))
        app.cms.add_router(Content('site', REPO, path='content/site',
                                   content_meta=meta_default,
                                   url=''))
        middleware.extend(app.cms.middleware())
        return middleware

    def get_template_full_path(self, app, name):
        return os.path.join(REPO, 'content', 'templates', name)

    def on_html_document(self, app, request, doc):
        doc.head.embedded_js.append('var gexamples = {}, giottoQueue = [];\n')
        doc.attr('ng-controller', 'GiottoExample')
