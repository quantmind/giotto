export {all} from './src/core/main';
export {default as scopeFactory} from './src/core/scope';
export {Paper} from './src/core/paper';
export {data} from './src/data/index';
export {Plugin} from './src/core/plugin';
export {array, quant, collection} from './src/core/d3';
export {default as gradient} from './src/core/gradient';
export {version} from './package.json';
export {constants} from './src/core/defaults';
export {theme} from './src/core/theme';
export {angularModule} from './src/integrations/angular';
export {default as orderedMap} from './src/utils/map';
export {default as canvasSelect, tweenAttr} from './src/canvas/index';

export {default as logger} from './src/utils/log';


import {version} from './package.json';
import giotto from './src/core/main';
//
import './src/drawing/index';
import './src/plugins/index';

giotto.version = version;

export {giotto};
