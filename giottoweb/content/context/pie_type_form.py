from lux import forms


class PieTypeForm(forms.Form):
    type = forms.ChoiceField(options=('svg', 'canvas'))
    padding = forms.FloatField(min=0, max=30)
    cornerRadius = forms.FloatField(min=0, max=30, label='corner radius')
    innerRadius = forms.FloatField(min=0, max=0.9, label='inner radius')

    layout = forms.Layout()


def template():
    return PieTypeForm().layout.as_form()