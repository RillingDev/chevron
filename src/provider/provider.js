"use strict";

import {
    _more,
    _service,
    _error
} from "../constants";

/**
 * Checks if service exist, else add it
 * @param String name to register/id the service
 * @param Array list of dependencies
 * @param String type of service (service/factory)
 * @param Function content of the service
 * @return Chevron instance
 */
export default function (type, name, deps, fn) {
    let _this = this;

    if (_this.chev[name]) {
        //throw error if a service with this name already exists
        throw _this.id + _error + type + _more + _service + " '" + name + "' already defined";
    } else {
        //Add the service to container
        _this.chev[name] = {
            type,
            name,
            deps,
            fn,
            init: false
        };

        return _this;
    }
}
