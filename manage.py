'''Build the giotto web site::

    python manage.py build_static
'''
import lux
import sys


def argv(*argv):
    return sys.argv[:1] + list(argv)


if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'build_static':
        args = argv('style', '--cssfile', 'dist/giotto')
        if '--nominify' not in sys.argv:
            args.append('--minify')
        # Build css file for giotto
        lux.execute_from_config('giottoweb',
                                argv=args,
                                EXTENSIONS=['lux.extensions.ui',
                                            'giottoweb.giotto'],
                                EXCLUDE_EXTENSIONS_CSS=['lux.extensions.ui',
                                                        'giottoweb'])
        # Build css file for example site
        lux.execute_from_config('giottoweb',
                                argv=argv('style'),
                                EXCLUDE_EXTENSIONS_CSS=['giottoweb.giotto'])
    # Execute command
    lux.execute_from_config('giottoweb')
