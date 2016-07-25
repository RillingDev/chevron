"use strict";
import add from "./add";
import {
    _service,
    _error
} from "../strings";

//Pushes new service/factory
export default function(name, deps, type, fn, args) {
    let _this = this;

    if (_this.chev[name]) {
        throw `${_this.id}${_error}${type}: ${_service} '${name}' is already defined`;
    } else {
        add.apply(_this, arguments);

        return _this;
    }
}
