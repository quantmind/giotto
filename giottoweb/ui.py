from lux.extensions.ui import *


def add_css(all):
    css = all.css
    vars = all.variables
    vars.sidebar.width = px(200)

    vars.font_family = '"freight-text-pro",Georgia,Cambria,"Times New Roman",Times,serif'
    vars.font_size = px(18)
    vars.line_height = 1.5
    vars.color = color(0,0,0,0.8)
    vars.scroll.background = '#99EBFF'

    css('.page-header',
        padding_top=vars.navbar.height)

    css('.page-header.index-header',
        background='#333',
        color='#fff',
        margin=0,
        width=pc(100),
        height=pc(100),
        min_height=pc(100))

    css('html, body, .fullpage',
        height=pc(100),
        min_height=pc(100))

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