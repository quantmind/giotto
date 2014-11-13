'''
Lux application for building the example website

https://github.com/quantmind/lux
'''
from os import path

import lux
from lux.extensions.static import HtmlContent


SITE_URL = 'http://quantmind.github.io/giotto'
HTML_TITLE = 'GiottoJs Examples'
STATIC_LOCATION = '../docs/giotto'
CONTEXT_LOCATION = 'giottoweb/content/context'
MEDIA_URL = '/'
ANGULAR_UI_ROUTER = True
STATIC_API = 'examples/ng'
MINIFIED_MEDIA = True
ASSET_PROTOCOL = 'http:'
EXTENSIONS = ['lux.extensions.base',
              'lux.extensions.ui',
              'lux.extensions.code',
              'lux.extensions.angular',
              'lux.extensions.static',
              'website.giotto']
HTML_LINKS = ['dist/giotto',
              'dist/examples.css']
REQUIREJS = [MEDIA_URL + 'dist/d3extweb.js']


class Extension(lux.Extension):

    def middleware(self, app):
        examples = HtmlContent('/', drafts=False, dir='website/content')
        return [examples]


def add_css(all):
    from lux.extensions.ui import px, Radius, Shadow, color

    css = all.css
    vars = all.variables
    vars.sidebar.width = px(200)

    css('.trianglify-background',
        padding_top=px(30))

    css('.trianglify-box',
        Radius(px(5)),
        Shadow(px(1), px(1), px(4), color=color(0, 0, 0, 0.4)),
        padding=px(20),
        max_width=px(400),
        background=color(255, 255, 255, 0.6))
