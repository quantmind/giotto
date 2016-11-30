import {map} from 'd3-collection';
import {assign, isPromise, isArray} from 'd3-let';
import {viewWarn as warn} from 'd3-view';

import defaultSerie from './serie';


// create a data store object for a view
function dataStore (vm) {
    vm = vm.root;
    var store = vm._dataStore;
    if (!store) {
        store = new DataStore(vm);
        vm._dataStore = store;
    }
    return store;
}


function DataStore (vm) {
    this.$series = map();
    this.$vm = vm;
}


DataStore.prototype = dataStore.prototype = {

    size () {
        return this.$series.size();
    },

    // set/get or delete a data serie @ name
    serie (name, newSerie) {
        if (arguments.length === 1) return this.$series.get(name);
        if (newSerie === null) {
            var p = this.$series.get(name);
            this.$series.remove(name);
            return p;
        }
        var serie = assign({}, defaultSerie, newSerie);
        serie.init();
        this.$series.set(name, serie);
        return this;
    },

    getList (name, params) {
        var serie = this.$series.get(name),
            result = serie ? serie.getList(params) : [];

        if (!isPromise(result)) {
            result = new Promise((resolve) => {resolve(result);});
            if (!serie) {
                warn(`Serie "${name} not available`);
                return result;
            }
        }

        return result.then((data) => {
            if (!isArray(data)) {
                warn(`Excepted an array, got ${typeof data}`);
                data = [];
            }
            serie.add(data);
            return data;
        });
    }
};


export default dataStore;
