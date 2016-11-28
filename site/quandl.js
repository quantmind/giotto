import * as d3 from 'giotto';

const
    quandlUrl = 'https://www.quandl.com/api/v3/datasets/',
    authToken = 'v3ebx8S9fs6aSWr473av';

export default function (expr, opts) {
    var self = this,
        format = opts.format || 'csv',
        window = opts.window,
        url = quandlUrl + expr + '.' + format + '?' + authToken,
        loader = d3.request[format];

    if (window) {
        var d = d3.time.timeDay,
            today = d.round(new Date),
            start = d.offset(today, -d3.quant.period(window).totalDays);
        url += '&start_date=' + d3.timeFormat.isoFormat(start);
    }

    if (!loader) throw new Error('Cannot load ' + format);

    loader(url, function (error, data) {
        if (error)
            throw new Error(error);
        self.ready(data, expr, opts);
    });
}
