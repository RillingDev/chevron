"use strict";
import prepare from "./prepare";
import {
    _error,
    _isUndefined
} from "../strings";

//Returns prepared service
export default function(name) {
    let _this = this,
        accessedService = _this.chev[name];

    //Check if accessed service is registered
    if (accessedService) {
        return prepare.call(_this, accessedService).fn;
    } else {
        throw `${_this.id}${_error}${name}: '${name}'${_isUndefined}`;
    }
}
