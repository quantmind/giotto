require([
    'js/require.config',
    'angular',
    'giotto',
    'lux/forms/main',
    'lux/nav/main'
], function(lux, angular, giotto) {
    'use strict';

    // Create giotto angular module first
    giotto.angularModule(angular);
    lux.bootstrap('giottojs', ['lux.form', 'lux.sidebar', 'giotto']);
});
