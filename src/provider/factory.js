"use strict";

import {
    _factory
} from "../constants";

/**
 * Create a new factory
 * @param String name to register/id the service
 * @param Array list of dependencies
 * @param String type of service (service/factory)
 * @param Function content of the service
 * @param Array factory arguments
 * @return this
 */
export default function (name, deps, Constructor) {
    return this.provider(
        _factory,
        name,
        deps,
        Constructor
    );
}
