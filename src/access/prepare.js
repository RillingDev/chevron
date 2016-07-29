"use strict";

import initialize from "./initialize";
import recurseDependencies from "./dependencies";
import {
    _more,
    _error,
    _isUndefined
} from "../constants";

/**
 * Check if every dependency is available
 * @private
 * @param Object service to check
 * @return bound service
 */
export default function (service) {
    let _this = this,
        list = {};

    //Recurse trough service deps
    recurseDependencies.call(
        _this,
        service.deps,
        //run this over every dependency to add it to the dependencyList
        dependency => {
            //make sure if dependency is initialized, then add
            list[dependency.name] = initialize.call(_this, dependency, list).fn;
        },
        //error if dependency is missing
        name => {
            throw _this.id + _error + service.name + _more + "dependency " + name + _isUndefined;
        }
    );

    return initialize.call(_this, service, list);
}
