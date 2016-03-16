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
     * @param record: the array of data
     * @param source: the source of this data provider
     * @param opts: optional parameters for the data provider
     */
    ready (record, source, opts) {
        var logger = this.logger,
            transform = opts.transform || 'default',
            transformFunction = data.transforms.get(transform);

        if (!transformFunction)
            this.logger.error('Cannot find transform function "' + transform + "'");
        else {
            var self = this,
                serie = transformFunction(record, opts);

            // Inject load method into the serie
            serie.load = function () {
                logger.info('Load data for ' + serie.name);
                self.load(source, opts);
            };
            this.parent.set(serie);
        }
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


class Eval extends DataProvider {

    load (expr, opts) {
        if (!data.$eval)
            this.logger.error('Cannot evaluate expression, data.$eval function is not available');
        else {
            this.logger.info('Evaluating expression: ' + expr);
            var result = data.$eval(expr, opts);
            if (result)
                this.ready(result, expr, opts);
        }
    }
}


data.providers.set('eval', Eval);
