"use strict";

import bundle from "./bundle";
import recurseDependencies from "./dependencies";
import {
    _error,
    _isUndefined
} from "../strings";

/**
 * Check if every dependency is available
 * @private
 * @param Object service to check
 * @return bound service
 */
export default function (service) {
    let list = {};

    //Recurse trough service deps
    recurseDependencies.call(
        this,
        service.deps,
        //run this over every dependency to add it to the dependencyList
        dependency => {
            //make sure if dependency is initialized, then add
            list[dependency.name] = bundle(dependency, list).fn;
        },
        //error if dependency is missing
        name => {
            throw `${this.id}${_error}${service.name}: dependency '${name}'${_isUndefined}`;
        }
    );

    return bundle(service, list);
}
