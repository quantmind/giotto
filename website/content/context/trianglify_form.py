from lux import forms


class Trianglify(forms.Form):
    size = forms.IntegerField(default=100, min_value=1, max_value=1000)
    opacity = forms.FloatField(default=1, min_value=0, max_value=1)

    angular = forms.AngularLayout(
        forms.AngularFieldset(all=True),
        forms.AngularSubmit('redraw', click="luxforms.redraw"))


def template():
    return Trianglify().angular.as_form()

