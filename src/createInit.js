"use strict";

import bootstrapDependency from "./bootstrapDependency";

/**
 * Inits the module
 * @returns {Mixed} Module content
 */
const createInit = function (_container, _module, dependencies, constructorFunction) {
    const constructedDependencies = dependencies.map(dependencyName => bootstrapDependency(_container, dependencyName));

    //Calls constructorFunction on the module
    _module.c = constructorFunction(_module.c, constructedDependencies);
    _module.r = true;

    return _module.c;
};

export default createInit;
