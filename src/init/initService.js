"use strict";

export default function (service, bundle) {
    //Construct service
    let serviceFn = service.fn;

    service.fn = function () {
        //Chevron service function wrapper
        return serviceFn.apply(null, bundle.concat(Array.from(arguments)));
    };

    return service;
}
