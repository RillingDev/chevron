"use strict";

/**
 * Collects dependencies and initializes service
 *
 * @private
 * @param {Object} _this The context
 * @param {Object} service The service to check
 * @param {Object} list The list of dependencies
 * @returns {Object} Returns `service`
 */
export default function (service, list, cf) {
    if (!service.init) {
        const bundle = [];

        //Collect an ordered Array of dependencies
        service.deps.forEach(item => {
            const dependency = list[item];

            if (dependency) {
                bundle.push(dependency.fn);
            }
        });

        //Init service
        //Call Constructor fn with service/deps
        service = cf(service, bundle);
        service.init = true;
    }

    return service;
}
