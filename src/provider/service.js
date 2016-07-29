"use strict";

import {
    _service
} from "../constants";

/**
 * Create a new service
 * @param String name to register/id the service
 * @param Array list of dependencies
 * @param String type of service (service/factory)
 * @param Function content of the service
 * @return Chevron instance
 */
export default function (_this) {
    console.log(_this);

    _this.extend(_service, function (service, bundle) {
        //Construct service
        let serviceFn = service.fn;

        service.fn = function () {
            //Chevron service function wrapper
            return serviceFn.apply(null, bundle.concat(Array.from(arguments)));
        };

        return service;
    });
}
