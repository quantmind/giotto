import navbar from './navbar';
import messages from './messages';
import year from './year';
import grid from './grid';


export default {

    install (vm) {
        vm.addComponent('navbar', navbar);
        vm.addComponent('messages', messages);
        vm.addComponent('year', year);
        vm.addComponent('d3grid', grid);
    }
};
