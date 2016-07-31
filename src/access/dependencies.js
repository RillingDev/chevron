"use strict";

import {
    _each
} from "../util";
import {
    _more,
    _error,
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
    _each(service.deps, name => {
        let dependency = _this.chev[name];

        if (dependency) {
            //recurse over sub-deps
            r(_this, dependency, fn);
            //run fn
            fn(dependency);
        } else {
            //if not found error with name
            throw _this.id + _error + service.name + _more + "dependency " + name + _isUndefined;
        }
    });
}
