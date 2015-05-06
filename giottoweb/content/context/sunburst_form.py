from lux import forms


class SunburstForm(forms.Form):
    '''Form for the Trianglify page'''
    scale = forms.ChoiceField(options=('sqrt', 'linear'))


Layout = forms.Layout(SunburstForm)


def template():
    return Layout().as_form()