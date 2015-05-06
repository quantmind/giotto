from lux import forms


class Collision(forms.Form):
    '''Form for the Trianglify page'''
    gravity = forms.FloatField(default=0.05, min=0, max=1)
    charge = forms.FloatField(default=-0.02)
    friction = forms.FloatField(default=0.9, min=0, max=1)

Layout = forms.Layout(Collision)


def template():
    return Layout().as_form()
