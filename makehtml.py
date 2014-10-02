'''Create the index.html for testing::

    grunt
    python maketesthtml.py build_static
'''
import lux
import sys


if __name__ == '__main__':
    # Build css file for d3ext
    lux.execute_from_config('tests', argv=[__file__, 'style', '--minify',
                                           '--cssfile', 'dist/d3ext'],
                            EXTENSIONS=['lux.extensions.ui'],
                            EXCLUDE_EXTENSIONS_CSS=['lux.extensions.ui'])
    # Build css file for example site
    lux.execute_from_config('tests', argv=[__file__, 'style',
                                           '--cssfile', 'dist/examples'],
                            EXCLUDE_EXTENSIONS_CSS=['tests'])
    # Build example site
    lux.execute_from_config('tests', argv=[__file__, 'build_static'])
