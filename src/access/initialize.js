"use strict";

import {
    _eachObject
} from "../util";

/**
 * Collects dependencies and initializes service
 * @private
 * @param Object service to check
 * @param Object list of dependencies
 * @return Object service
 */
export default function (service, list) {
    let bundle = [];

    if (!service.init) {
        //Collect dependencies for this service
        _eachObject(list, (item, key) => {
            if (service.deps.includes(key)) {
                bundle.push(item);
            }
        });

        //Init service
        service = this.tl[service.type](service, bundle);
        service.init = true;
    }

    return service;
}
