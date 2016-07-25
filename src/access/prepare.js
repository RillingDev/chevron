"use strict";
import bundle from "./bundle";
import recurseDependencies from "./dependencies";
import _error from "../strings/error";

//Main access function; makes sure that every service need is available
export default function (service) {
    let _this = this,
        list = {};

    recurseDependencies(
        _this.chev,
        service._deps,
        dependency => {
            list[dependency._name] = bundle(dependency, list)._fn;
        },
        name => {
            throw `${_this.n}${_error}${service._name}: dependency '${name}' missing`;
        }
    );

    return bundle(service, list);
}
