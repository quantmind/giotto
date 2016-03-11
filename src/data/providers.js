import {map} from 'd3-collection';
import {data} from './data';

/**
 * Base class for data providers
 */
class DataProvider extends data.DataBase {

    load () {}

    /**
     * Method called once the data is ready to be dispatched
     *
     * @param data
     * @param opts
     */
    ready (record, opts) {
        var transform = opts.transform || 'default',
            transformFunction = data.transforms.get(transform);
        if (!transformFunction)
            this.logger.error('Cannot find transform function "' + transform + "'");
        else
            this.parent.set(transformFunction(record, opts));
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
            this.ready(entry, opts);
    }
}


data.providers.set('values', Values);


class Eval extends DataProvider {

    load (expr, opts) {
        if (!data.$eval)
            this.logger.error('Cannot evaluate expression, data.$eval function is not available');
        else {
            this.logger.info('Evaluating expression: ' + expr);
            var result = data.$eval(expr, opts);
            if (result)
                this.ready(result, opts);
        }
    }
}


data.providers.set('eval', Eval);
