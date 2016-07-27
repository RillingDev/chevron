"use strict";

/**
 * Add a new service/factory to the container
 * @private
 * @param String name to register/id the service
 * @param Array list of dependencies
 * @param String type of service (service/factory)
 * @param Function content of the service
 * @param Array (optional) factory arguments
 * @return void
 */
export default function (name, deps, type, fn, args) {
    this.chev[name] = {
        name,
        type,
        deps,
        args: args || [],
        fn,
        init: false
    };
}
