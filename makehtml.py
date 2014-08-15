'''Create the index.html for testing

python maketesthtml.py build_static
'''
import lux
import sys


if __name__ == '__main__':
    lux.execute_from_config('tests', argv=[__file__, 'style', '--minify',
                                           '--cssfile', 'dist/d3ext'])
    lux.execute_from_config('tests', argv=[__file__, 'build_static'])
