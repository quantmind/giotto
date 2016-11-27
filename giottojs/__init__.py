"""Lux application for building giottojs.org

To compile::

    pip3 install -r requirements.txt
    python3 manage.py static
"""
import os

from pulsar.apps.wsgi import MediaRouter

from lux.core import LuxExtension


class Extension(LuxExtension):

    def middleware(self, app):
        d = os.path.dirname
        path = os.path.join(d(d(d(__file__))), 'giottojs.org')
        yield MediaRouter('/', path,
                          serve_only=('json', 'png', 'jpeg', 'svg',
                                      'txt', 'js', 'ico'))
