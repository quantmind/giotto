from lux import forms

lines = ('linear', 'linear-closed', 'step', 'step-before', 'step-after',
         'basis', 'basis-open', 'basis-closed', 'bundle', 'cardinal',
         'cardinal-open', 'cardinal-closed', 'monotone')

symbols = ('circle', 'cross', 'diamond', 'square', 'triangle-down',
           'triangle-up')

class LineTypeForm(forms.Form):
    '''Form for the Trianglify page'''
    type = forms.ChoiceField(options=('svg', 'canvas'))
    interpolate = forms.ChoiceField(options=lines)
    symbol = forms.ChoiceField(options=symbols)

    layout = forms.Layout(showLabels=False)


def template():
    return LineTypeForm().layout.as_form()