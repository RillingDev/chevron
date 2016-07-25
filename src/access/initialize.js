"use strict";
import {
    _service
} from "../strings";

//Initialized service and sets init to true
export default function (service, bundle) {
    if (service.type === _service) {
        //Construct service
        let serviceFn = service.fn;

        service.fn = function () {
            //Chevron service function wrapper
            return serviceFn.apply(null,
                Array.from(bundle.concat(Array.from(arguments)))
            );
        };
    } else {
        //Construct factory
        bundle = bundle.concat(service.args);
        bundle.unshift(null);
        //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
        service.fn = new(Function.prototype.bind.apply(service.fn, bundle));
    }

    service.init = true;
    return service;
}
