"use strict";
import bundle from "./bundle";
import recurseDependencies from "./dependencies";

export default function (chev,service) {
    let list = {};

    recurseDependencies(
        chev,
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
