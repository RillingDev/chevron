"use strict";
import util from "../util";
import prepare from "./prepare";

export default function (name) {
    let _this = this,
        accessedService = _this.chev[name];

    //Check if accessed service is registered
    if (accessedService) {
        return prepare(_this.chev, accessedService).fn;
    } else {
        throw `${_this.name}: error accessing ${name}: '${name}' is not defined`;
    }

}
