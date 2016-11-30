// table component
import {isString} from 'd3-let';


export default {
    props: ['json'],

    render (data) {
        var json = data.json,
            container = this.createElement('div').classed('d3-grid', true),
            self = this;

        // grid properties are remote
        if (isString(json)) {
            this.fetch(json).then(self.build);
        }
        return container;
    },

    build (data) {
        if (data.target)
            this.fetch(data.target);
    }
};
