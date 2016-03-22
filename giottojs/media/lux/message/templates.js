define(['angular'], function (angular) {
    "use strict";

    angular.module('lux.message.templates', [])
        .run(["$templateCache", function ($templateCache) {

            $templateCache.put("lux/message/templates/message.tpl.html",
                     "<div>\n" +
         "    <div class=\"alert alert-{{ message.type }}\" role=\"alert\" ng-repeat=\"message in messages\">\n" +
         "        <a href=\"#\" class=\"close\" ng-click=\"removeMessage($event, message)\">&times;</a>\n" +
         "        <i ng-if=\"message.icon\" ng-class=\"message.icon\"></i>\n" +
         "        <span ng-bind-html=\"message.text\"></span>\n" +
         "    </div>\n" +
         "</div>\n" +
         "\n"
            );

        }]);

});
