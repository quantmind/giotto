import {map} from 'd3-collection';
import {forEach, isArray, isObject} from 'd3-quant';
import {default as queue} from '../queue/queue';


export class Data {

    constructor (data) {
        this.$sources = map();
        this.update(data);
    }

    get (name) {
        return this.$sources.get(name);
    }

    set (name, data) {
        var sources = this.$sources;
        var current = sources.get(name);
        sources.set(name, data);
        if (current)
            // We are removing this data, we need to notify all objects using this data
            current.broadcast('replace', data);
    }

    update (data) {
        if (!data || data === this) return;

        if (!isArray(data)) data = [data];
        var self = this;

        data.forEach(function (d) {
            var name = d.name || 'default',
                current = self.get(name);
            if (current) current.update(d.data);
            else self.set(name, data);
        })
    }

}


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
