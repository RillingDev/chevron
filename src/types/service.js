"use strict";

const typeService = function (_module, dependencies) {
    //Dereference fn to avoid unwanted recursion
    const serviceFn = _module.fn;

    _module.fn = function () {
        //Chevron service function wrapper
        //return function with args injected
        return serviceFn.apply(null, dependencies.concat(Array.from(arguments)));
    };

    return _module;
};

export default typeService;
