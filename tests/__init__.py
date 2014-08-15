from os import path

import lux
from lux.extensions.static import HtmlContent


HTML_TITLE = 'd3ext test runner'
STATIC_LOCATION = path.join(path.dirname(path.abspath('__file__')), 'dist')
CONTEXT_LOCATION = None
MEDIA_URL = ''
STATIC_API = None
STATIC_MEDIA = False
MINIFIED_MEDIA = False
EXTENSIONS = ['lux.extensions.base',
              'lux.extensions.ui',
              'lux.extensions.html5',
              'lux.extensions.static']


class Extension(lux.Extension):

    def middleware(self, app):
        return [HtmlContent('/', drafts=False, dir='tests/html')]


def add_css(all):
    css = all.css
    media = all.media
    d3 = all.variables.d3

    d3.sunburst_stroke = '#fff'

    css('.sunburst',
        css(' path',
            stroke=d3.sunburst_stroke,
            fill_rule='evenodd'))
