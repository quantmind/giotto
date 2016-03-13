export {default as giotto} from './src/core/main';
export {default as scopeFactory} from './src/core/scope';
export {Paper} from './src/core/paper';
export {data} from './src/data/index';
export {Plugin} from './src/core/plugin';
export {array, quant} from './src/core/d3';
export {default as gradient} from './src/core/gradient';
export {version} from './package.json';
export {constants} from './src/core/defaults';
export {theme} from './src/core/theme';
export {angularModule} from './src/integrations/angular';
export {default as orderedMap} from './src/utils/map';
export {default as canvasSelect} from './src/canvas/index';


import {version} from './package.json';
import {default as giotto} from './src/core/main';
//
// drawings
import './src/drawing/area';
import './src/drawing/bars';
import './src/drawing/line';
import './src/drawing/pie';
import './src/drawing/points';
//
// plugins
import './src/plugins/margin';
import './src/plugins/background';
import './src/plugins/grid';
import './src/plugins/axis';
import './src/plugins/responsive';
import './src/plugins/transitions';
import './src/plugins/tooltip';

giotto.version = version;
