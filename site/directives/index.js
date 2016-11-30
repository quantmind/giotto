import fullpage from './fullpage';
import highlight from './highlight';


export default {

    install (vm) {
        vm.addDirective('fullpage', fullpage);
        vm.addDirective('highlight', highlight);
    }
};
