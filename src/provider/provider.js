"use strict";
import add from "./add";
import _error from "../strings/error";
import _service from "../strings/service";

//Pushes new service/factory
export default function (_name, _deps, _type, _fn, _args) {
    let _this = this;

    if (_this.chev[_name]) {
        throw `${_this.n}${_error}${_type}: ${_service} '${_name}' is already defined`;
    } else {
        add.apply(_this, arguments);

        return _this;
    }
}
