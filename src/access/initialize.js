"use strict";

import {
    _each
} from "../util";

/**
 * Collects dependencies and initializes service
 * @private
 * @param Object context
 * @param Object service to check
 * @param Object list of dependencies
 * @return Object service
 */
export default function(_this, service, list) {
    let bundle = [];

    if (!service.init) {
        _each(service.deps, item => {
            let dep = list[item];

            if (dep) {
                bundle.push(dep);
            }
        });

        //Init service
        service = _this.tl[service.type](service, bundle.map(item => {
            return item.fn;
        }));
        service.init = true;
    }

    return service;
}
