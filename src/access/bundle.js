"use strict";

import util from "../util";
import initialize from "./initialize";

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
        util._eachObject(list, (item, key) => {
            if (service.deps.includes(key)) {
                bundle.push(item);
            }
        });

        return initialize(service, bundle);
    } else {
        return service;
    }
}
