"use strict";

/**
 * Init function for a module
 * @param {Chevron} instance
 * @param {Object} _module
 * @param {Array} dependencies
 * @param {Function} constructorFunction
 * @returns {Mixed}
 */
const initModule = function (instance, _module, dependencies, constructorFunction) {
    const constructedDependencies = dependencies.map(dependencyName => instance.get(dependencyName));

    //Calls constructorFunction on the module
    _module.c = constructorFunction(_module.c, constructedDependencies);
    _module.r = true;

    return _module.c;
};

export default initModule;
