"use strict";

import bootstrapDependency from "./bootstrapDependency";

/**
 * Init function for a module
 * @param {Map} _container
 * @param {Object} _module
 * @param {Array} dependencies
 * @param {Function} constructorFunction
 * @returns {Mixed}
 */
const initModule = function (_container, _module, dependencies, constructorFunction) {
    const constructedDependencies = dependencies.map(dependencyName => bootstrapDependency(_container, dependencyName));

    //Calls constructorFunction on the module
    _module.c = constructorFunction(_module.c, constructedDependencies);
    _module.r = true;

    return _module.c;
};

export default initModule;
