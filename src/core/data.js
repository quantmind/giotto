import {map} from 'd3-collection';
import {forEach, isArray, isObject} from 'd3-quant';
import {default as queue} from '../queue/queue';


export function dataProviders (options, callback) {
    var q = queue();

    if (!isArray(options)) options = [options];

    options.forEach( (opts) => {

        if (isObject(opts)) {
            var name = opts.name;
            forEach(opts, (value, key) => {
                if (key !== 'name') {
                    var provider = dataProviders.register.get(key);
                    if (!provider)
                        throw Error('Data provider "' + key + '" not registered');
                    q.defer(provider, value, name);
                }
            });
        }

    });
    q.awaitAll(function (error, data) {
        if (error)
            throw Error(error);
        callback(data);
    });
}


dataProviders.register = map();


dataProviders.register.set('values', noop);


function noop(data, name, callback) {
    callback (null, {
        data: data,
        name: name
    });
}
