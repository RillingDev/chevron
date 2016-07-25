"use strict";
import add from "./add";
import _strings from "../strings";

//Pushes new service/factory
export default function (name, dependencyList, fn, type, args) {
    let _this = this;

    if (_this.chev[name]) {
        throw `${_this.name}${_strings._error}${type}: ${_strings._service} '${name}' is already defined`;
    } else {
        add(_this.chev, name, dependencyList, type, fn, args);

        return _this;
    }
}
