import data from './data';
import {evalString} from './providers';
import {serie, isNumber, isString, isFunction,
        isArray, crossfilterSerie} from 'd3-quant';
import {map} from 'd3-collection';


data.transforms = map();


data.transforms.set('default', function (record) {
    var s = serie(record.data, {name: record.name});
    record.series.set(s.name, s);
});


data.transforms.set('filter', function (record, opts) {
    var dimension = opts.dimension;
    if (!dimension) throw Error('filter transform require a dimension to filter on');
    var s = crossfilterSerie(record.data, {name: record.name});
    dimension = evalAndName(s, dimension);

    var filter = opts.filter,
        dserie = s.dimension(dimension.eval, {name: dimension.name}),
        fserie;

    if (filter) {
        if (!isArray(filter)) filter = [filter];
        filter.forEach((o) => {
            o = evalAndName(dserie, o);
            fserie = dserie.dimension(dimension.eval, {name: o.name}).filter(o.eval);
            record.series.set(fserie.name, fserie);
        });
    } else {
        record.series.set(dserie.name, dserie);
    }
});


function evalAndName(serie, o) {
    o = evalString(o, true);

    if (isString(o) || isNumber(o)) o = {name: ''+o, 'eval': o};
    else if (isFunction(o)) o = {eval: o};
    else o.eval = evalString(o.eval);

    o.name = o.name ? serie.name + '.' + o.name : serie.name;

    return o;
}
