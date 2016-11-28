import {viewElement} from 'd3-view';


const navbarTpl = `<nav class="navbar" d3-class="[theme, ['navbar-fixed-top', fixedTop]]">
    <a class="navbar-brand" d3-if="brand.title || brand.image" d3-attr-href="brand.href || '#'" d3-html="brand.title">
        <img d3-if="brand.image" d3-attr-src="brand.image" d3-attr-alt="brand.title">
    </a>
    <ul class="nav navbar-nav">
        <li d3-for="item in items" class="nav-item" d3-active>
            <a class="nav-link"
                d3-attr-href="item.href || '#'"
                d3-html="item.title"
                d3-if="item.show ? item.show() : true"
                d3-on-click="item.click ? item.click() : null"></a>
        </li>
    </ul>
</nav>`;


export default {

    model: {
        fixedTop: true,
        theme: "navbar-light bg-faded",
        brand: {},
        items: []
    },

    render () {
        return viewElement(navbarTpl);
    }
};
