from agile import AgileManager

app_module = 'giottojs'
note_file = 'docs/notes.md'


if __name__ == '__main__':
    AgileManager(description='Release manager for giotto.js & giottojs.org',
                 config='release.py').start()
