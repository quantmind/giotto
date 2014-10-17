'''Create the index.html for testing::

    grunt
    python maketesthtml.py build_static
'''
import lux
import sys


def argv(*argv):
    return sys.argv[:1] + list(argv)


if __name__ == '__main__':
    name = 'website'
    if len(sys.argv) > 1 and sys.argv[1] == 'build_static':
        args = argv('style', '--cssfile', 'dist/d3ext')
        if '--nominify' not in sys.argv:
            args.append('--minify')
        # Build css file for d3ext
        lux.execute_from_config(name,
                                argv=args,
                                EXTENSIONS=['lux.extensions.ui',
                                            'website.d3ext'],
                                EXCLUDE_EXTENSIONS_CSS=['lux.extensions.ui',
                                                        'website'])
        # Build css file for example site
        lux.execute_from_config(name,
                                argv=argv('style', '--cssfile',
                                          'dist/examples'),
                                EXCLUDE_EXTENSIONS_CSS=['website.d3ext'])
    # Execute command
    lux.execute_from_config('website')
