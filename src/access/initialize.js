"use strict";

/**
 * Collects dependencies and initializes service
 * @private
 * @param Object context
 * @param Object service to check
 * @param Object list of dependencies
 * @return Object service
 */
export default function (_this, service, list) {
    let bundle = [];

    if (!service.init) {
        service.deps.forEach(item => {
            const dependency = list[item];

            if (dependency) {
                bundle.push(dependency.fn);
            }
        });

        //Init service
        service = _this.tl[service.type](service, bundle);
        service.init = true;
    }

    return service;
}
