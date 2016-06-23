import {map} from 'd3-collection';
import {isArray, isObject, forEach, mapFields} from 'd3-quant';
import {GiottoBase} from '../core/defaults';


function data (scope) {
    return new data.Data(scope);
}

export default data;

/**
 * Class for managing data providers, data transforms and data events
 */
class Data extends GiottoBase {

    constructor ($scope) {
        super($scope);
        this.$scope.$sources = map();
        this.$scope.$records = map();
        this.$scope.$providers = map();
    }

    get (name) {
        return this.$scope.$sources.get(name);
    }

    getOne (name) {
        var one = this.get(name);
        if (!one) {
            var values = this.$scope.$sources.values();
            if (values.length === 1) return values[0];
            return this.get('default') || values[0];
        }
        return one;
    }

    size () {
        return this.$scope.$sources.size();
    }

    set (serie) {
        this.logger.debug('Data: setting new serie "' + serie.name + '"');
        this.$scope.$sources.set(serie.name, serie);
        this.broadcast('data', serie);
    }

    provider (name) {
        var providers = this.$scope.$providers,
            p = providers.get(name);
        if (!p) {
            var Provider = data.providers.get(name);
            if (!Provider)
                this.logger.error('Unknown data provider "' + name + '"');
            else {
                p = new Provider(this.$scope.$new());
                providers.set(name, p);
            }
        }
        return p;
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
        });
    }

    load (options) {
        if (arguments.length === 0) return this.reLoad();

        if (!isArray(options)) options = [options];
        var self = this,
            provider;

        options.forEach((opts) => {
            if (isObject(opts)) {
                data.providers.each(function (_, key) {
                    var entry = opts[key];
                    if (entry) {
                        provider = self.provider(key);
                        if (provider)
                            provider.load(entry, opts);
                    }
                });
            }
        });
    }

    reLoad () {
        this.$scope.$records.each((record) => {
            record.load();
        });
    }

    /**
     * Create a new serie record from data
     * @param data Array of data record
     * @param source: original source object
     * @param opts: object of data options
     * @param load: loading function
     */
    record (data, source, opts, load) {
        var fields = opts.fields;
        //
        // Fields available, map array of array into array of objects
        if (fields) {
            data = mapFields(fields, data);
        } else {
            fields = [];
            forEach(data[0], function (key) {
                fields.push(key);
            });
        }
        var record = Object.freeze({
            'name': opts.name,
            'data': data,
            'fields': fields,
            'series': map(),
            'opts': opts,
            'source': source,
            'load': load
        });

        this.$scope.$records.set(record.name, record);
        return record;
    }
}

data.DataBase = GiottoBase;
data.Data = Data;
