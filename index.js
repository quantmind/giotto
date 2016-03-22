export {all} from './src/core/main';
export {default as scopeFactory} from './src/core/scope';
export {Paper} from './src/core/paper';
export {data} from './src/data/index';
export {Plugin} from './src/core/plugin';
export {default as gradient} from './src/core/gradient';
export {version} from './package.json';
export {constants} from './src/core/defaults';
export {theme} from './src/core/theme';
export {angularModule} from './src/integrations/angular';

import * as utils from './src/utils/index';

export {array, time, quant, collection, request,
        format, timeFormat} from './src/integrations/d3';

import {version} from './package.json';
import giotto from './src/core/main';
//
import './src/drawing/index';
import './src/plugins/index';

giotto.version = version;

export {giotto};
export {utils};
