"use strict";

import {
    _service
} from "../constants";

/**
 * Create a new service
 * @param String name to register/id the service
 * @param Array list of dependencies
 * @param String type of service (service/factory)
 * @param Function content of the service
 * @return this
 */
export default function (name, deps, fn) {
    return this.provider(
        _service,
        name,
        deps,
        fn
    );
}
