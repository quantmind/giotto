    //
    //  Giotto Context Menu
    //
    //  Returns a function which can be used to bind the context menu to
    //  a node element.
    g.contextMenu = function () {
        var element = null,
            menuElement = null,
            opened = false,
            disabled = false,
            events = d3.dispatch('open', 'close');

        function menu (target, callback) {
            init();
            target
                .on('keyup.gmenu', handleKeyUpEvent)
                .on('click.gmenu', handleClickEvent)
                .on('contextmenu.gmenu', handleContextMenu(callback));
        }

        menu.disabled  = function (x) {
            if (!arguments.length) return disabled;
            disabled = x ? true : false;
            return menu;
        };

        d3.rebind(menu, events, 'on');

        return menu;

        // INTERNALS

        function handleKeyUpEvent () {
            if (!disabled && opened && d3.event.keyCode === 27)
                close();
        }

        function handleClickEvent () {
            var event = d3.event;
            if (!disabled && opened && event.button !== 2 || event.target !== element)
                close();
        }

        function handleContextMenu (callback) {
            if (callback)
                return function () {
                    if (disabled) return;
                    var event = d3.event;
                    event.preventDefault();
                    event.stopPropagation();
                    close();
                    element = this;
                    open(event, callback);
                };
        }

        function open (event, callback) {
            if (callback) callback(menuElement);
            menuElement.classed('open', true);

            var docLeft = (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || 0),
                docTop = (window.pageYOffset || document.scrollTop || 0) - (document.clientTop || 0),
                elementWidth = menuElement.node().scrollWidth,
                elementHeight = menuElement.node().scrollHeight,
                docWidth = document.clientWidth + docLeft,
                docHeight = document.clientHeight + docTop,
                totalWidth = elementWidth + event.pageX,
                totalHeight = elementHeight + event.pageY,
                left = Math.max(event.pageX - docLeft, 0),
                top = Math.max(event.pageY - docTop, 0);

            if (totalWidth > docWidth)
                left = left - (totalWidth - docWidth);

            if (totalHeight > docHeight)
                top = top - (totalHeight - docHeight);

            menuElement.style({
                top: top + 'px',
                left: left + 'px',
                position: 'fixed'
            });
            opened = true;
        }

        function close () {
            menuElement.classed('open', false);
            if (opened)
                events.close();
            opened = false;
        }

        function init () {
            if (!menuElement) {

                menuElement = d3.select(document.createElement('div'))
                                .attr('class', 'giotto-menu');
                close();
                document.body.appendChild(menuElement.node());

                d3.select(document)
                    .on('keyup.gmenu', handleKeyUpEvent)
                    // Firefox treats a right-click as a click and a contextmenu event
                    // while other browsers just treat it as a contextmenu event
                    .on('click.gmenu', handleClickEvent)
                    .on('contextmenu.gmenu', handleClickEvent);
            }
        }

    };

    //
    // Context menu singletone
    g.contextmenu = g.contextMenu();


    //
    //  Context Menu Plugin for Visualization
    //  ==========================================
    //
    //  * layout create the html layout
    //  * itms is a list of options to display
    g.viz.plugin('menu', {

        defaults: {
            layout: function (viz, menu, items) {
                menu.append('ul')
                    .attr({'class': 'dropdown-menu',
                           'role': 'menu'})
                    .selectAll('li')
                    .data(items)
                    .enter()
                    .append('li').attr('role', 'presentation')
                    .append('a').attr('role', 'menuitem').attr('href', '#')
                    .text(function (d) {return isFunction(d.label) ? d.label() : d.label;})
                    .on('click', function (d) {
                        if (d.callback) d.callback(viz);
                    });
            },
            items: null
        },

        init: function (viz) {

            viz.on('tick.menu', function () {
                var opts = viz.options();
                if (opts.menu.items)
                    g.contextmenu(viz.element(), function (menu) {
                        menu.select('*').remove();
                        return opts.menu.layout(viz, menu, opts.menu.items);
                    });
                else
                    g.contextmenu(viz.element());
            });
        }
    });
