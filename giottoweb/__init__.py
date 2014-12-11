'''
Lux application for building the example website

https://github.com/quantmind/lux
'''
SITE_URL = 'http://quantmind.github.io/giotto'
HTML_TITLE = 'GiottoJs Examples'
STATIC_LOCATION = '../docs/giotto'
CONTEXT_LOCATION = 'giottoweb/content/context'
MEDIA_URL = '/media/'
ANGULAR_UI_ROUTER = False
STATIC_API = 'ng'
MINIFIED_MEDIA = True
EXTENSIONS = ['lux.extensions.base',
              'lux.extensions.ui',
              'lux.extensions.code',
              'lux.extensions.angular',
              'lux.extensions.static',
              'lux.extensions.sitemap',
              'lux.extensions.code',
              'giottoweb.giotto']
HTML_LINKS = ['giotto/giotto',
              'giottoweb/giottoweb.css']
REQUIREJS = ['.giottoweb/giottoweb.js']

LINKS = {'AngularJS': 'https://angularjs.org/',
         'RequireJS': 'http://requirejs.org/',
         'd3': 'http://d3js.org/'}


from os import path

import lux
from lux.extensions.static import (HtmlContent, MediaBuilder, Sitemap,
                                   DirContent, Blog)

examples_meta = {'template': 'examples.md',
                 'twitter:card': 'summary_large_image'}


class Extension(lux.Extension):

    def middleware(self, app):
        media_url = app.config['MEDIA_URL']
        examples = HtmlContent('/',
                               Sitemap('/sitemap.xml'),
                               Blog('/examples',
                                    meta=examples_meta,
                                    content=DirContent,
                                    dir='examples',
                                    drafts=False),
                               drafts=False,
                               dir='giottoweb/content/site')
        dist = MediaBuilder(media_url+'giotto', 'dist', lux=False)
        return [dist, examples]

    def on_html_document(self, app, request, doc):
        doc.head.embedded_js.append('var gexamples = {};\n')


def add_css(all):
    from lux.extensions.ui import px, Radius, Shadow, color

    css = all.css
    vars = all.variables
    vars.sidebar.width = px(200)

    vars.font_family = '"freight-text-pro",Georgia,Cambria,"Times New Roman",Times,serif'
    vars.font_size = px(18)
    vars.line_height = 1.5
    vars.color = color(0,0,0,0.8)
    vars.scroll.background = '#99EBFF'

    css('.trianglify-background',
        padding_top=px(30))

    css('.trianglify-box',
        Radius(px(5)),
        Shadow(px(1), px(1), px(4), color=color(0, 0, 0, 0.4)),
        padding=px(20),
        max_width=px(400),
        background=color(255, 255, 255, 0.6))

    error_page(all)


def error_page(all):
    from lux.extensions.ui import px, pc, spacing, color, BoxSizing, Background
    css = all.css
    media = all.media
    cfg = all.app.config
    mediaurl = cfg['MEDIA_URL']
    collapse_width = px(cfg['NAVBAR_COLLAPSE_WIDTH'])

    css('#page-error',
        css(' a, a:hover',
            color=color('#fff'),
            text_decoration='underline'),
        Background(url=mediaurl+'giottoweb/see.jpg',
                   size='cover',
                   repeat='no-repeat',
                   position='left top'),
        color=color('#fff'))
    css('.error-message-container',
        BoxSizing('border-box'),
        padding=spacing(40, 120),
        background=color(0, 0, 0, 0.4),
        height=pc(100)),
    css('.error-message',
        css(' p',
            font_size=px(50)))
    media(max_width=collapse_width).css(
        '.error-message p',
        font_size=px(32)).css(
        '.error-message-container',
        text_align='center',
        padding=spacing(40, 0))
