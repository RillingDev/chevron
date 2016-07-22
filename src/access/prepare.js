"use strict";
import bundle from "./bundle";
import recurseDependencies from "./dependencies";

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
            throw `${_this.name}: error in ${service.name}: dependency '${name}' is missing`;
        }
    );

    return bundle(service, list);
}
