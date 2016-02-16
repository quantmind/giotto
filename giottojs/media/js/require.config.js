/* eslint-plugin-disable angular */
define(['lux/config/main'], function (lux) {
    'use strict';

    var localRequiredPath = lux.PATH_TO_LOCAL_REQUIRED_FILES || '';

    lux.require.paths = lux.extend(lux.require.paths, {
        'giotto': localRequiredPath + 'giotto'
    });

    lux.config();

    return lux;
});
