import {dataStore} from './data/index';

// Dashboard component
export default {

    render (data) {
        var store = dataStore(this);
        store.load(data);
    }
};
