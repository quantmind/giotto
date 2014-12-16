'''Lux extension for creating giotto css file
'''
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

    d3.sunburst_stroke = '#fff'

    css(' .sunburst',
        css(' text',
            #white_space='normal'
            z_index=9999),
        css(' path',
            stroke=d3.sunburst_stroke,
            fill_rule='evenodd'))


    css(' .axis',
        fill='none',
        shape_rendering='crispEdges')

    css(' .line',
        fill='none')

    css('.d3-tip',
        css(':after',
            BoxSizing('border-box'),
            display='inline',
            font_size=px(16),
            width=pc(100),
            line_height=1,
            position='absolute'),
        css('.n:after',
            content='"\\25BC"',
            margin='-2px 0 0 0',
            top=pc(100),
            left=0,
            text_align='center'),
        css('.e:after',
            content='"\\25C0"',
            margin='-4px 0 0 0',
            top=pc(50),
            left='-8px'),
        css('.s:after',
            content='"\\25B2"',
            margin='0 0 2px 0',
            top='-8px',
            left=0,
            text_align='center'),
        css('.w:after',
            content='"\\25B6"',
            margin='-4px 0 0 -1px',
            top='50%',
            left='100%'))



