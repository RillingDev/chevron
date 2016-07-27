"use strict";

import add from "./add";
import {
    _service,
    _error
} from "../strings";

/**
 * Checks if service exist, else add it
 * @param String name to register/id the service
 * @param Array list of dependencies
 * @param String type of service (service/factory)
 * @param Function content of the service
 * @return this
 */
export default function(name, deps, type, fn, args) {
    let _this = this;

    if (_this.chev[name]) {
        //throw error if a service with this name already exists
        throw `${_this.id}${_error}${type}: ${_service} '${name}' is already defined`;
    } else {
        //Call the add function with bound context
        add.apply(_this, arguments);

        return _this;
    }
}
