'''Create the index.html for testing

python maketesthtml.py build_static
'''
import lux


if __name__ == '__main__':
    lux.execute_from_config('tests')
