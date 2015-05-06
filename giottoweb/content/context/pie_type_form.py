from lux import forms


class PieTypeForm(forms.Form):
    padAngle = forms.FloatField(
        default=1,
        min=0,
        max=20,
        label='pad angle',
        required=False)
    cornerRadius = forms.FloatField(
        default=0.01,
        min=0,
        max=30,
        label='corner radius',
        required=False)
    innerRadius = forms.FloatField(
        default=0.6,
        min=0,
        max=0.99,
        label='inner radius',
        required=False)

Layout = forms.Layout(PieTypeForm)


def template():
    return Layout().as_form()
