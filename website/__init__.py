'''
Lux application for building the example page
'''
from os import path

import lux
from lux.extensions.static import HtmlContent


SITE_URL = 'http://quantmind.github.io/d3ext'
HTML_TITLE = 'd3ext examples'
STATIC_LOCATION = ''
CONTEXT_LOCATION = None
MEDIA_URL = '/'
STATIC_API = None
MINIFIED_MEDIA = True
ASSET_PROTOCOL = 'http:'
EXTENSIONS = ['lux.extensions.base',
              'lux.extensions.ui',
              'lux.extensions.code',
              'lux.extensions.angular',
              'lux.extensions.static',
              'website.d3ext']
HTML_LINKS = ['dist/d3ext.css',
              'dist/examples.css']


class Extension(lux.Extension):

    def middleware(self, app):
        examples = HtmlContent('/', drafts=False, dir='website/content')
        return [examples]


def add_css(all):
    from lux.extensions.ui import px

    css = all.css
    vars = all.variables
    vars.sidebar.width = px(200)
