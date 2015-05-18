
    g.quandl = {

        baseurl: 'https://www.quandl.com/api/v1/datasets/',

        apikey: 'v3ebx8S9fs6aSWr473av',

        url: function (url) {
            url = g.quandl.baseurl + url + '?auth_token=' + g.quandl.apikey;
            return url;
        }
    };