"use strict";

import initialize from "./initialize";
import recurseDependencies from "./recurseDependencies";


/**
 * Check if every dependency is available
 *
 * @private
 * @param {Object} _this The context
 * @param {Object} service The service to prepare
 * @return {Object} Initialized service
 */
export default function (_this, service) {
    const list = {};

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
