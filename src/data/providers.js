import {map} from 'd3-collection';
import data from './data';
import {isArray, isObject, isString} from 'd3-quant';

/**
 * Base class for data providers
 */
class DataProvider extends data.DataBase {

    load () {}

    /**
     * Method called once the data is ready to be dispatched
     *
     * @param record: the array of data
     * @param source: the source of this data provider
     * @param opts: optional parameters for the data provider
     */
    ready (record, source, opts) {
        var logger = this.logger,
            transform = opts.transform || 'default',
            self = this;

        opts.name = opts.name || 'default';

        record = this.data.record(record, source, opts, function () {
            logger.info('Load data for ' + opts.name);
            self.load(source, opts);
        });

        if (!isArray(transform)) transform = [transform];

        transform.forEach(t => {
            if (!isObject(t)) t = {type: t};
            if (!t.type) this.logger.error('Transform "type" not specified');
            else {
                var transformFunction = data.transforms.get(t.type);
                if (!transformFunction)
                    this.logger.error('Cannot find transform function "' + t.type + "'");
                else
                    transformFunction(record, t);
            }
        });

        record.series.each((serie) => {
            self.data.set(serie);
        });
    }
}


data.providers = map();
data.$eval = null;
data.Provider = DataProvider;


class Values extends DataProvider {

    load (entry, opts) {
        if (!entry || !entry.forEach)
            this.logger.error('Values data provider received invalid data');
        else
            this.ready(entry, entry, opts);
    }
}


data.providers.set('values', Values);

const evalErrorMessage = 'Cannot evaluate expression, data.$eval function is not available';

class Eval extends DataProvider {

    load (expr, opts) {
        if (!data.$eval)
            this.logger.error(evalErrorMessage);
        else {
            this.logger.info('Evaluating expression: ' + expr);
            var result = data.$eval(expr, opts);
            if (result)
                this.ready(result, expr, opts);
        }
    }
}


data.providers.set('eval', Eval);


export function evalString (str, safe) {
    if (isString(str)) {
        if (!data.$eval) {
            if (safe) return str;
            else throw Error(evalErrorMessage);
        }
        try {
            var r = data.$eval(str);
            if (r === undefined)
                throw new Error('Could not evaluate ' + str);
            return r;
        } catch (e) {
            if (safe) return str;
            else throw e;
        }
    }
    return str;
}
