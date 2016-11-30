import {viewExpression} from 'd3-view';


export default function (expression) {
    var expr = viewExpression(expression);

    return filter;

    function filter (value) {
        return expr.eval(value);
    }
}
