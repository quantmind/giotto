define(['angular'], function (angular) {
    "use strict";

    angular.module('lux.nav.templates', [])
        .run(["$templateCache", function ($templateCache) {

            $templateCache.put("lux/nav/templates/link.tpl.html",
                     "<a ng-href=\"{{link.href}}\" title=\"{{link.title}}\" ng-click=\"links.click($event, link)\"\n" +
         "ng-attr-target=\"{{link.target}}\" ng-class=\"link.klass\" bs-tooltip=\"tooltip\">\n" +
         "<span ng-if=\"link.left\" class=\"left-divider\"></span>\n" +
         "<i ng-if=\"link.icon\" class=\"{{link.icon}}\"></i>\n" +
         "<span>{{link.label || link.name}}</span>\n" +
         "<span ng-if=\"link.right\" class=\"right-divider\"></span></a>\n" +
         "\n"
            );

            $templateCache.put("lux/nav/templates/navbar.tpl.html",
                     "<nav ng-attr-id=\"{{navbar.id}}\" class=\"navbar navbar-{{navbar.themeTop}}\"\n" +
         "ng-class=\"{'navbar-fixed-top':navbar.fixed, 'navbar-static-top':navbar.top}\" role=\"navigation\">\n" +
         "    <div ng-class=\"navbar.container\">\n" +
         "        <div class=\"navbar-header\">\n" +
         "            <button ng-if=\"navbar.toggle\" type=\"button\" class=\"navbar-toggle\" ng-click=\"navbar.isCollapsed = !navbar.isCollapsed\">\n" +
         "                <span class=\"sr-only\">Toggle navigation</span>\n" +
         "                <span class=\"icon-bar\"></span>\n" +
         "                <span class=\"icon-bar\"></span>\n" +
         "                <span class=\"icon-bar\"></span>\n" +
         "            </button>\n" +
         "            <ul class=\"nav navbar-nav main-nav\">\n" +
         "                <li ng-if=\"navbar.itemsLeft\" ng-repeat=\"link in navbar.itemsLeft\" ng-class=\"{active:links.activeLink(link)}\" navbar-link>\n" +
         "                </li>\n" +
         "            </ul>\n" +
         "            <a ng-if=\"navbar.brandImage\" href=\"{{navbar.url}}\" class=\"navbar-brand\" target=\"{{navbar.target}}\">\n" +
         "                <img ng-src=\"{{navbar.brandImage}}\" alt=\"{{navbar.brand || 'brand'}}\">\n" +
         "            </a>\n" +
         "            <a ng-if=\"!navbar.brandImage && navbar.brand\" href=\"{{navbar.url}}\" class=\"navbar-brand\" target=\"{{navbar.target}}\">\n" +
         "                {{navbar.brand}}\n" +
         "            </a>\n" +
         "        </div>\n" +
         "        <nav class=\"navbar-collapse\" uib-collapse=\"navbar.isCollapsed\">\n" +
         "            <ul ng-if=\"navbar.items\" class=\"nav navbar-nav navbar-left\">\n" +
         "                <li ng-repeat=\"link in navbar.items\" ng-class=\"{active:links.activeLink(link)}\" navbar-link></li>\n" +
         "            </ul>\n" +
         "            <ul ng-if=\"navbar.itemsRight\" class=\"nav navbar-nav navbar-right\">\n" +
         "                <li ng-repeat=\"link in navbar.itemsRight\" ng-class=\"{active:links.activeLink(link)}\" navbar-link>\n" +
         "                </li>\n" +
         "            </ul>\n" +
         "        </nav>\n" +
         "    </div>\n" +
         "</nav>\n" +
         "\n"
            );

            $templateCache.put("lux/nav/templates/sidebar.tpl.html",
                     "<navbar class=\"sidebar-navbar\" ng-class=\"{'sidebar-open-left': navbar.left, 'sidebar-open-right': navbar.right}\"></navbar>\n" +
         "<aside ng-repeat=\"sidebar in sidebars\"\n" +
         "       class=\"sidebar sidebar-{{ sidebar.position }}\"\n" +
         "       ng-attr-id=\"{{ sidebar.id }}\"\n" +
         "       ng-class=\"{'sidebar-fixed': sidebar.fixed, 'sidebar-open': sidebar.open, 'sidebar-close': sidebar.closed}\" bs-collapse>\n" +
         "    <div class=\"nav-panel\">\n" +
         "        <div ng-if=\"sidebar.user\">\n" +
         "            <div ng-if=\"sidebar.user.avatar_url\" class=\"pull-{{ sidebar.position }} image\">\n" +
         "                <img ng-src=\"{{sidebar.user.avatar_url}}\" alt=\"User Image\" />\n" +
         "            </div>\n" +
         "            <div class=\"pull-left info\">\n" +
         "                <p>{{ sidebar.infoText }}</p>\n" +
         "                <a ng-attr-href=\"{{sidebar.user.username ? '/' + sidebar.user.username : '#'}}\">{{sidebar.user.name}}</a>\n" +
         "            </div>\n" +
         "        </div>\n" +
         "    </div>\n" +
         "    <ul class=\"sidebar-menu\">\n" +
         "        <li ng-if=\"section.name\" ng-repeat-start=\"section in sidebar.sections\" class=\"header\">\n" +
         "            {{section.name}}\n" +
         "        </li>\n" +
         "        <li ng-repeat-end ng-repeat=\"link in section.items\" class=\"treeview\"\n" +
         "        ng-class=\"{active:links.activeLink(link)}\" ng-include=\"'subnav'\"></li>\n" +
         "    </ul>\n" +
         "</aside>\n" +
         "<div class=\"sidebar-page\" ng-class=\"{'sidebar-open-left': navbar.left, 'sidebar-open-right': navbar.right}\" ng-click=\"closeSidebars()\">\n" +
         "    <div class=\"overlay\"></div>\n" +
         "</div>\n" +
         "\n" +
         "<script type=\"text/ng-template\" id=\"subnav\">\n" +
         "    <a ng-href=\"{{link.href}}\" ng-attr-title=\"{{link.title}}\" ng-click=\"sidebar.menuCollapse($event)\">\n" +
         "        <i ng-if=\"link.icon\" class=\"{{link.icon}}\"></i>\n" +
         "        <span>{{link.name}}</span>\n" +
         "        <i ng-if=\"link.subitems\" class=\"fa fa-angle-left pull-right\"></i>\n" +
         "    </a>\n" +
         "    <ul class=\"treeview-menu\" ng-class=\"{active:links.activeSubmenu(link)}\" ng-if=\"link.subitems\">\n" +
         "        <li ng-repeat=\"link in link.subitems\" ng-class=\"{active:links.activeLink(link)}\" ng-include=\"'subnav'\">\n" +
         "        </li>\n" +
         "    </ul>\n" +
         "</script>\n" +
         "\n"
            );

        }]);

});
