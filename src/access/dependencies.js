"use strict";
import util from "../util";

//Iterate deps
export default function r(container, dependencyList, fn, error) {
    util.each(dependencyList, name => {
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
