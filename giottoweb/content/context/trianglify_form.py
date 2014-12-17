from lux import forms


class Trianglify(forms.Form):
    '''Form for the Trianglify page'''
    cellsize = forms.IntegerField(min_value=1, max_value=1000,
                                  label='cell size', initial=100)
    fillOpacity = forms.FloatField(min_value=0, max_value=1,
                                   label='fill opacity', initial=1)
    strokeOpacity = forms.FloatField(min_value=0, max_value=1,
                                     label='stroke opacity', initial=1)
    noiseIntensity = forms.FloatField(min_value=0, max_value=1,
                                      label='noise intensity', initial=0)
    x_gradient = forms.ChoiceField(label='x gradient', required=False)
    y_gradient = forms.ChoiceField(label='y gradient', required=False)

    angular = forms.AngularLayout(
        forms.AngularFieldset(all=True),
        forms.AngularSubmit('redraw', click="luxforms.redraw", disabled="form.$invalid"),
        model='trianglify',
        layout='horizontal',
        labelSpan=6)


def template():
    return Trianglify().angular.as_form()

