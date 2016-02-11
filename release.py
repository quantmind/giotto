from agile import AgileManager

note_file = 'docs/notes.md'


if __name__ == '__main__':
    AgileManager(config='release.py').start()
