
    var quandl = {

        url: 'https://www.quandl.com/api/v1/datasets'

        apikey: 'v3ebx8S9fs6aSWr473av',

        get: function (url) {
            url = quandl.url + url + '?auth_token=' + quandl.apikey;
            return url;
        }
    };