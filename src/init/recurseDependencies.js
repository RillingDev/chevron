"use strict";

/**
 * Loops trough dependencies, recurse if new dependencies has dependencies itself; then execute fn.
 * @private
 * @param {Object} $map The chevron container
 * @param {Array} _module The module to recurse
 * @param {Function} fn The function run over each dependency
 */
const recurseDependencies = function ($map, _module, fn) {
    _module.deps.forEach(name => {
        const dependency = $map.get(name);

        if (dependency) {
            //recurse over sub-deps
            recurseDependencies($map, dependency, fn);
            //run fn
            fn(dependency);
        } else {
            //if the dependency is not found, throw error with name
            throw new Error(_module.name + " is missing dep '" + name + "'");
        }
    });
};

export default recurseDependencies;
