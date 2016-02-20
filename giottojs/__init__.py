"""Lux application for building giottojs.org

To compile::

    pip3 install -r requirements.txt
    python3 manage.py static
"""
import os

from pulsar.utils.httpurl import remove_double_slash

import lux
from lux.extensions.content import Content, CMS


DESCRIPTION = ('GiottoJS is a javascript visualization library built on '
               'top of d3js. '
               'It is designed to visualize both SVG and Canvas elements '
               'with a simple API. AngularJS integration')

SITE_URL = 'http://giottojs.org'

HTML_TITLE = 'GiottoJs Examples'
DEFAULT_CONTENT_TYPE = 'text/html'
SERVE_STATIC_FILES = True
FAVICON = 'favicon.ico'
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
              {'href': 'sandstone', 'id': 'giotto-theme'}]
SCRIPTS = ['giottojs']

HTML_META = [{'http-equiv': 'X-UA-Compatible',
              'content': 'IE=edge'},
             {'name': 'viewport',
              'content': 'width=device-width, initial-scale=1'},
             {'name': 'description', 'content': DESCRIPTION}]

LINKS = {'AngularJS': 'https://angularjs.org/',
         'RequireJS': 'http://requirejs.org/',
         'd3': 'http://d3js.org/',
         'd3js': 'http://d3js.org/'}

CONTENT_REPOSITORY = os.path.dirname(__file__)
CMS_PARTIALS_PATH = os.path.join(CONTENT_REPOSITORY, 'context')

meta_default = {'image': '$site_url$site_media/giottoweb/giotto.png',
                'twitter:card': 'summary_large_image',
                'template': 'partials/base.html'}

example_list_meta = {'title': 'GiottoJS Examples',
                     'description': 'A list of GiottoJS examples'}
examples_meta = {'template': 'partials/examples.html',
                 'twitter:card': 'summary_large_image'}


class Example(Content):

    def read(self, request, name):
        read = super().read
        ct = read(request, name)
        if 'path' in request.urlargs and ct.is_html:
            path = request.urlargs['path']
            path = remove_double_slash('%s/giotto.json' % path)
            giotto = read(request, path).text
            mkdown = '\n'.join(('```json', giotto, '```'))
            reader = lux.get_reader(request.app, 'script.md')
            content = reader.process(mkdown, 'script')
            ct.meta['html_giotto'] = content.html(request)
            ct.meta['script_giotto'] = giotto
        return ct


class Extension(lux.Extension):

    def middleware(self, app):
        repo = CONTENT_REPOSITORY
        app.cms = CMS(app)
        middleware = []
        if repo and os.path.isdir(repo):
            site = Content('site', repo, '')
            exam = Example('examples', repo,
                           content_meta=examples_meta)
            app.cms.add_router(exam)
            app.cms.add_router(site)
            middleware.extend(app.cms.middleware())
        return middleware
