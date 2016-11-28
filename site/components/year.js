export default {

    render () {
        var year = new Date().getFullYear();
        return this.viewElement(`<span>${year}</span>`);
    }
};
