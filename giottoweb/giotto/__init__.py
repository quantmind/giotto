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

    tip(all)
    slider(all)


def tip(all):
    css = all.css
    media = all.media
    d3 = all.variables.d3

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


def slider(all):
    css = all.css
    media = all.media
    d3 = all.variables.d3
    d3.slider.margin = 20
    d3.slider.axismargin = d3.slider.margin + 10

    css('.d3-slider',
        Border(width=px(1), style='solid'),
        margin=px(d3.slider.margin),
        position='relative',
        font_family='Verdana,Arial,sans-serif',
        font_size=em(1.1),
        z_index=2)

    css('.d3-slider-horizontal',
        css('.d3-slider-axis',
            margin_bottom=px(d3.slider.axismargin)),
        height=em(0.8))

    css('.d3-slider-range',
        position='absolute',
        left=0,
        right=0,
        height=em(0.8))

    css('.d3-slider-range-vertical',
        css('.d3-slider-axis',
            margin_right=px(d3.slider.axismargin)),
        position='absolute',
        left=0,
        right=0,
        top=0)

    css('.d3-slider-vertical',
        width=em(0.8),
        height=px(100))

    css('.d3-slider-handle',
        Radius(px(4)),
        Border(width=px(1), style='solid'),
        position='absolute',
        width=em(1.2),
        height=em(1.2),
        z_index=3)

    css('.d3-slider-horizontal .d3-slider-handle',
        top=em(-0.25),
        margin_left=em(-0.6))

    css('.d3-slider-axis',
        position='relative',
        z_index=1)

    css('.d3-slider-axis-bottom',
        top=em(0.8))

    css('.d3-slider-axis-right',
        left=em(0.8))

    css('.d3-slider-axis path',
        stroke_width=0,
        fill='none')

    css('.d3-slider-axis line',
        fill='none',
        shape_rendering='crispEdges')

    css('.d3-slider-axis text',
        font_size=px(11))

    css('.d3-slider-vertical .d3-slider-handle',
        left=em(-.25),
        margin_left=0,
        margin_bottom=em(-.6))
