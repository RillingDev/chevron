"use strict";

/**
 * @private
 * @param {Map} $map Chevron instance map
 * @param {Object} _module module
 * @param {Function} constructorFunction function init the module with
 * @returns {Mixed} constructed module content
 */
const construct = function ($map, _module, constructorFunction) {
    const dependencies = [];

    //Collects dependencies
    _module.deps.forEach(depName => {
        const dependency = $map.get(depName);

        if (dependency) {
            dependencies.push(dependency.rdy ? dependency.fn : dependency.init());
        } else {
            throw new Error(`Missing '${depName}'`);
        }
    });

    _module.fn = constructorFunction(_module.fn, dependencies);
    _module.rdy = true;

    return _module.fn;
};

export default construct;
