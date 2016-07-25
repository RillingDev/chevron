"use strict";
import add from "./add";
import _error from "../strings/error";
import _service from "../strings/service";

//Pushes new service/factory
export default function (name, dependencyList, fn, type, args) {
    let _this = this;

    if (_this.chev[name]) {
        throw `${_this.n}${_error}${type}: ${_service} '${name}' is already defined`;
    } else {
        add(_this.chev, name, dependencyList, type, fn, args);

        return _this;
    }
}
