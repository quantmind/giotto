from lux import forms


class PieTypeForm(forms.Form):
    type = forms.ChoiceField(options=('svg', 'canvas'))
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

    layout = forms.Layout()


def template():
    return PieTypeForm().layout.as_form()
