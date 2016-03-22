define(['angular'], function (angular) {
    "use strict";

    angular.module('lux.page.templates', [])
        .run(["$templateCache", function ($templateCache) {

            $templateCache.put("lux/page/templates/breadcrumbs.tpl.html",
                     "<ol class=\"breadcrumb\">\n" +
         "    <li ng-repeat=\"step in steps\" ng-class=\"{active: step.last}\">\n" +
         "        <a ng-if=\"!step.last\" href=\"{{step.href}}\">{{step.label}}</a>\n" +
         "        <span ng-if=\"step.last\">{{step.label}}</span>\n" +
         "    </li>\n" +
         "</ol>\n"
            );

            $templateCache.put("lux/page/templates/list-group.tpl.html",
                     "<div class=\"list-group\">\n" +
         "  <a ng-repeat=\"link in links\" ng-href=\"{{link.html_url}}\" class=\"list-group-item\"\n" +
         "  ng-bind=\"link.title\" ng-class=\"{active: link.html_url === $location.absUrl()}\"></a>\n" +
         "</div>\n" +
         "\n"
            );

        }]);

});
