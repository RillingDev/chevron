"use strict";


/**
 * Loops trough dependencies, recurse if new dependencies has dependencies itself; then execute fn.
 *
 * @private
 * @param {Object} _this The context
 * @param {Array} module The dependencyList to iterate
 * @param {Function} fn The function run over each dependency
 * @returns void
 */
export default function recurseDependencies(_this, module, fn) {
    //loop trough deps
    module.deps.forEach(name => {
        const dependency = _this.chev.get(name);

        if (dependency) {
            //recurse over sub-deps
            recurseDependencies(_this, dependency, fn);
            //run fn
            fn(dependency);
        } else {
            //if not found error with name
            throw _this.id + ": error in " + module.name + ": dep " + name + " missing";
        }
    });
}
