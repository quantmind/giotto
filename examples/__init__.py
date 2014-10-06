'''
Lux application for building the example page
'''
from os import path

import lux
from lux.extensions.static import HtmlContent
from lux.extensions.ui import CssInclude


HTML_TITLE = 'd3ext examples'
#STATIC_LOCATION = path.join(path.dirname(path.dirname(
#    path.abspath('__file__'))), 'docs', 'd3ext')
STATIC_LOCATION = ''
CONTEXT_LOCATION = None
MEDIA_URL = ''
STATIC_API = None
MINIFIED_MEDIA = True
ASSET_PROTOCOL = 'http:'
EXTENSIONS = ['lux.extensions.base',
              'lux.extensions.ui',
              'lux.extensions.code',
              'lux.extensions.angular',
              'lux.extensions.static']
HTML_LINKS = ['dist/d3ext.css',
              'dist/examples.css']


class Extension(lux.Extension):

    def middleware(self, app):
        examples = HtmlContent('/', drafts=False, dir='examples/html')
        return [examples]


def add_css(all):
    '''d3 extension style sheet
    '''
    css = all.css
    media = all.media
    d3 = all.variables.d3

    css('body',
        CssInclude('http://cdnjs.cloudflare.com/ajax/libs/c3/0.3.0/c3.css'))

    d3.sunburst_stroke = '#fff'

    css('.sunburst',
        css(' text',
            #white_space='normal'
            z_index=9999),
        css(' path',
            stroke=d3.sunburst_stroke,
            fill_rule='evenodd'))
