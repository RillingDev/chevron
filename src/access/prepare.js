"use strict";
import bundle from "./bundle";
import recurseDependencies from "./dependencies";
import _strings from "../strings";

//Main access function; makes sure that every service need is available
export default function (service) {
    let _this = this,
        list = {};

    recurseDependencies(
        _this.chev,
        service.deps,
        dependency => {
            list[dependency.name] = bundle(dependency, list).fn;
        },
        name => {
            throw `${_this.name}${_strings._error}${service.name}: dependency '${name}' missing`;
        }
    );

    return bundle(service, list);
}
