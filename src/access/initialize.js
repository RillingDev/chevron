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
export default function (_this, service, list) {
    if (!service.init) {
        let bundle = [];

        service.deps.forEach(item => {
            const dependency = list[item];

            if (dependency) {
                bundle.push(dependency.fn);
            }
        });

        //Init service
        service = service.cf(service, bundle);
        service.init = true;
    }

    return service;
}
