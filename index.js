export {default as giotto} from './src/core/main';
export {array} from './src/d3/index';
export {version} from './package.json';
export {defaults, constants} from './src/core/defaults';
export {theme} from './src/core/theme';
export {angularModule} from './src/integrations/angular';


import {version} from './package.json';
import {default as giotto} from './src/core/main';
import './src/drawing/points';

giotto.version = version;
