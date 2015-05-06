from lux import forms


class TypeForm(forms.Form):
    '''Form for the Trianglify page'''

Layout = forms.Layout(TypeForm,
                      forms.Fieldset(all=True),
                      forms.Submit('randomise'),
                      showLabels=False)


def template():
    return Layout().as_form()