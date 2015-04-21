from lux import forms


class Collision(forms.Form):
    '''Form for the Trianglify page'''
    type = forms.ChoiceField(options=('svg', 'canvas'))
    gravity = forms.FloatField(default=0.05, min=0, max=1)
    charge = forms.FloatField(default=-0.02)
    friction = forms.FloatField(default=0.9, min=0, max=1)

    layout = forms.Layout()


def template():
    return Collision().layout.as_form()
