"use strict";

import initialize from "./initialize";
import recurseDependencies from "./dependencies";


/**
 * Check if every dependency is available
 * @private
 * @param Object context
 * @param Object service to check
 * @return bound service
 */
export default function (_this, service) {
    let list = {};

    //Recurse trough service deps
    recurseDependencies(
        _this,
        service,
        //run this over every dependency to add it to the dependencyList
        dependency => {
            //make sure if dependency is initialized, then add
            list[dependency.name] = initialize(_this, dependency, list);
        }
    );

    return initialize(_this, service, list);
}
