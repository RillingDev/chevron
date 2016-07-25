"use strict";
import _strings from "../strings";

//Initialized service and sets init to true
export default function (service, bundle) {
    if (service._type === _strings._service) {
        //Construct service
        let serviceFn = service._fn;

        service._fn = function () {
            //Chevron service function wrapper
            return serviceFn.apply(null,
                Array.from(bundle.concat(Array.from(arguments)))
            );
        };
    } else {
        //Construct factory
        bundle = bundle.concat(service._args);
        bundle.unshift(null);
        //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
        service._fn = new(Function.prototype.bind.apply(service._fn, bundle));
    }

    service._init = true;
    return service;
}
