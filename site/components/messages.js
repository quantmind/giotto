import 'd3-transition';
import {viewElement} from 'd3-view';

const messagesTpl = `<div class="messages"></div>`;

const levels = {
    error: 'danger'
};


// component render function
export default function () {

    var self = this;
    this.root.events.on('message', (data) => {
        self.sel.append(() => {
            return messageEl(data);
        }).call(fadeIn);
    });

    return viewElement(messagesTpl);

}


function messageEl (data) {

    var level = data.level;
    if (!level) {
        if (data.error) level = 'error';
        else if (data.success) level = 'success';
    }
    level = levels[level] || level || 'info';
    return viewElement(`<div class="alert alert-${level}" role="alert" style="opacity: 0">
${data.message}
</div>`);
}


function fadeIn (selection) {
    return selection
        .transition()
            .duration(300)
            .style("opacity", 1);
}
