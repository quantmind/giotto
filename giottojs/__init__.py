"""Lux application for building giottojs.org

To compile::

    pip3 install -r requirements.txt
    python3 manage.py static
"""
import os

from pulsar.utils.httpurl import remove_double_slash
from pulsar.utils.string import to_string

import lux
from lux import Parameter
from lux.extensions.content import Content, CMS


meta_default = {'image': '$site_url$site_media/giottoweb/giotto.png',
                'twitter:card': 'summary_large_image',
                'template': 'partials/base.html'}

example_list_meta = {'title': 'GiottoJS Examples',
                     'description': 'A list of GiottoJS examples'}
examples_meta = {'template': 'partials/examples.html',
                 'twitter:card': 'summary_large_image'}


class Example:

    def context(self, request):
        if 'path' in request.urlargs:
            path = request.urlargs['path']
            path = remove_double_slash('%s/script.js' % path)
            script = to_string(self.render_file(request, path))
            mkdown = '\n'.join(('```javascript', script, '```'))
            reader = lux.get_reader(request.app, 'script.md')
            content = reader.process(mkdown, 'script')
            return dict(script_js=script,
                        html_script_js=content.html(request))


class Extension(lux.Extension):
    _config = (Parameter('CONTENT_REPOSITORY', None,
                         'content repository'),
               )

    def middleware(self, app):
        repo = app.config['CONTENT_REPOSITORY']
        app.cms = CMS(app)
        middleware = []
        if repo and os.path.isdir(repo):
            site = Content('site', repo, '')
            exam = Content('examples', repo,
                           content_meta=examples_meta)
            app.cms.add_router(exam)
            app.cms.add_router(site)
            middleware.extend(app.cms.middleware())
        return middleware


def main():
    lux.execute_from_config('giottojs.config')
