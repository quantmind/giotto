from lux import forms


class SunburstForm(forms.Form):
    '''Form for the Trianglify page'''
    scale = forms.ChoiceField(options=('sqrt', 'linear'))

    layout = forms.Layout()


def template():
    return SunburstForm().layout.as_form()