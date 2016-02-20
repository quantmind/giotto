"""Lux application for building giottojs.org

To compile::

    pip3 install -r requirements.txt
    python3 manage.py static
"""
import os

from pulsar.utils.httpurl import remove_double_slash

import lux
from lux.extensions.content import Content, CMS
from lux.utils.data import update_dict


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
              'lux.extensions.angular',
              'lux.extensions.sitemap',
              'lux.extensions.rest',
              'lux.extensions.content',
              'lux.extensions.oauth']

HTML_LINKS = ['https://cdnjs.cloudflare.com/ajax/libs/font-awesome/'
              '4.3.0/css/font-awesome.min.css',
              {'href': 'giottojs/sandstone', 'id': 'giotto-theme'}]
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

d = os.path.dirname
CONTENT_REPOSITORY = d(__file__)
CMS_PARTIALS_PATH = os.path.join(CONTENT_REPOSITORY, 'context')
STATIC_LOCATION = os.path.join(d(d(CONTENT_REPOSITORY)), 'docs', 'giotto')
OAUTH_PROVIDERS = {'google': {'analytics': {'id': 'UA-54439804-4'}},
                   'twitter': {'site': '@quantmind'}}

meta_default = {'image': '$site_url$site_media/giottoweb/giotto.png',
                'twitter:card': 'summary_large_image',
                'author': 'Luca Sbardella',
                'template': 'partials/base.html'}

example_list_meta = update_dict(meta_default,
                                {'title': 'GiottoJS Examples',
                                 'description': 'A list of GiottoJS examples'})

examples_meta = update_dict(meta_default,
                            {'template': 'partials/examples.html',
                             'image': '/examples/$name/image.png'})


class Example(Content):

    def context(self, request, instance, context):
        src = os.path.join(os.path.dirname(instance.src), 'giotto.json')
        if os.path.isfile(src):
            with open(src, 'r') as file:
                giotto = file.read()
            mkdown = '\n'.join(('```json', giotto, '```'))
            reader = lux.get_reader(request.app, 'script.md')
            content, _ = reader.process(src, mkdown)
            render = request.app.template_engine(instance.meta.template_engine)
            context['html_giotto'] = render(content, context)
            context['script_giotto'] = giotto
        return context


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
