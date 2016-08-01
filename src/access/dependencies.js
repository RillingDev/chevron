"use strict";

import {
    _errorStart,
    _more,
    _isUndefined
} from "../constants";

/**
 * Loops/recurses over list of dependencies
 * @private
 * @param Object context
 * @param Array dependencyList to iterate
 * @param Function to run over each dependency
 * @return void
 */
//Loops trough dependencies, recurse if new dependencies has dependencies itself; then execute fn.
export default function r(_this, service, fn) {
    //loop trough deps
    service.deps.forEach(name => {
        const dependency = _this.chev[name];

        if (dependency) {
            //recurse over sub-deps
            r(_this, dependency, fn);
            //run fn
            fn(dependency);
        } else {
            //if not found error with name
            throw _errorStart(_this) + service.name + _more + "dependency " + name + _isUndefined;
        }
    });
}
