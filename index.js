export {default as giotto} from './src/core/main';
export {Plugin} from './src/core/paper';
export {array, quant} from './src/core/d3';
export {default as gradient} from './src/core/gradient';
export {version} from './package.json';
export {defaults, constants} from './src/core/defaults';
export {theme} from './src/core/theme';
export {angularModule} from './src/integrations/angular';


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
import './src/plugins/background';
import './src/plugins/grid';
import './src/plugins/axis';
import './src/plugins/responsive';
import './src/plugins/transitions';

giotto.version = version;
