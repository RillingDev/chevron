"use strict";
import util from "../util";
import prepare from "./prepare";
import _error from "../strings/error";

//Returns prepared service
export default function (name) {
    let _this = this,
        accessedService = _this.chev[name];

    //Check if accessed service is registered
    if (accessedService) {
        return prepare.call(_this, accessedService)._fn;
    } else {
        throw `${_this.n}${_error}${name}: '${name}' is undefined`;
    }
}
