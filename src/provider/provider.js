"use strict";
import add from "./add";

//Pushes new service/factory
export default function (name, dependencyList, fn, type, args) {
    let _this = this;

    if (_this.chev[name]) {
        throw `${_this.name}: error in ${type}: service '${name}' is already defined`;
    } else {
        add(_this.chev, name, dependencyList, type, fn, args);

        return _this;
    }
}
