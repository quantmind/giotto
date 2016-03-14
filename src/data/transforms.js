import {data} from './data';
import {serie, indexValue} from 'd3-quant';
import {map} from 'd3-collection';


data.transforms = map();

data.transforms.set('default', function (data, opts) {
    return serie(data, opts);
});

data.transforms.set('xy', function (data, opts) {
    return serie(data, opts).x(indexValue('x')).y(indexValue('y'));
});
