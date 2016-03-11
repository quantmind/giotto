import {data} from './data';
import {serie, indexValue} from 'd3-quant';
import {map} from 'd3-collection';


data.transforms = map();

data.transforms.set('default', function (data, opts) {
    return serie(opts).data(data);
});

data.transforms.set('xy', function (data, opts) {
    return serie(opts).data(data).x(indexValue('x')).y(indexValue('y'));
});
