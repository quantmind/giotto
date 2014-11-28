'''Lux extension for creating giotto css file
'''
import lux
from lux.extensions.ui import *


class Extension(lux.Extension):
    pass


def add_css(all):
    '''d3 extension style sheet
    '''
    css = all.css('.giotto').css
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



