'''Create the index.html for testing::

    grunt
    python maketesthtml.py build_static
'''
import lux
import sys


def argv(*argv):
    return sys.argv[:1] + list(argv)


def argvall(*argv):
    return sys.argv[:1] + list(argv) + sys.argv[1:]


if __name__ == '__main__':
    # Build css file for d3ext
    lux.execute_from_config('examples',
                            argv=argv('style', '--minify',
                                      '--cssfile', 'dist/d3ext'),
                            EXTENSIONS=['lux.extensions.ui'],
                            EXCLUDE_EXTENSIONS_CSS=['lux.extensions.ui'])
    # Build css file for example site
    lux.execute_from_config('examples',
                            argv=argv('style', '--cssfile', 'dist/examples'),
                            EXCLUDE_EXTENSIONS_CSS=['examples'])
    # Build example site
    lux.execute_from_config('examples', argv=argvall('build_static'))
