"use strict";
import util from "../util";

//Loops trough dependencies, recurse if new dependencies has dependencies itself; then execute fn.
export default function r(container, dependencyList, fn, error) {
    util._each(dependencyList, name => {
        let service = container[name];
        if (service) {

            if (service.deps.length > 0) {
                //recurse
                r(container, service.deps, fn, error);
            }
            fn(service);
        } else {
            error(name);
        }
    });
}
