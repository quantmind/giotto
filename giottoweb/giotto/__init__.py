import lux
from lux.extensions.ui import *


class Extension(lux.Extension):
    pass


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

