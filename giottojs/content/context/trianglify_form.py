from lux import forms


class Trianglify(forms.Form):
    '''Form for the Trianglify page'''
    cellsize = forms.IntegerField(min_value=1, max_value=1000,
                                  label='cell size', default=100)
    fillOpacity = forms.FloatField(min_value=0, max_value=1,
                                   label='fill opacity', default=1)
    strokeOpacity = forms.FloatField(min_value=0, max_value=1,
                                     label='stroke opacity', default=1)
    noiseIntensity = forms.FloatField(min_value=0, max_value=1,
                                      label='noise intensity', default=0)
    x_gradient = forms.ChoiceField(label='x gradient', required=False)
    y_gradient = forms.ChoiceField(label='y gradient', required=False)


Layout = forms.Layout(
    Trianglify,
    forms.Fieldset(all=True),
    forms.Submit('redraw', click="luxforms.redraw", disabled="form.$invalid"),
    model='trianglify',
    layout='horizontal',
    labelSpan=6)


def template():
    return Layout().as_form()

