"use strict";

import {
    _factory
} from "../strings";

/**
 * Create a new factory
 * @param String name to register/id the service
 * @param Array list of dependencies
 * @param String type of service (service/factory)
 * @param Function content of the service
 * @param Array factory arguments
 * @return this
 */
export default function (name, deps, Constructor, args) {
    return this.provider(
        name,
        deps,
        _factory,
        Constructor,
        args
    );
}
