import {map} from 'd3-collection';


class OrderedMap {

    constructor () {
        this.$map = map();
        this.$array = [];
    }

    get length () {
        return this.$array.length;
    }

    get (key) {
        return this.$map.get(key);
    }

    set (key, value) {
        if (!this.has(key))
            this.$array.push(key);
        this.$map.set(key, value);
    }

    has (key) {
        return this.$map.has(key);
    }

    clear () {
        this.$map.clear();
        this.$array.splice(0);
    }

    keys () {
        var entries = [];
        this.forEach(function (v, k) {
            entries.push(k);
        });
        return entries;
    }

    values () {
        var entries = [];
        this.forEach(function (v) {
            entries.push(v);
        });
        return entries;
    }

    forEach (callback) {
        var a = this.$array,
            key;
        for (var i=0; i<a.length; ++i) {
            key = a[i];
            callback(this.$map.get(key), key, i);
        }
    }

}


export default function () {
    return new OrderedMap()
}
