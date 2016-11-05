"use strict";

/**
 * Constructor function for the factory type
 * @private
 * @param {Object} module The module object
 * @param {Array} dependencies Array of dependency contents
 * @returns {Mixed} Initialized module
 */
const factory = function(module, dependencies) {
    //First value gets ignored by calling 'new' like this, so we need to fill it with something
    dependencies.unshift(0);

    //Apply into new constructor by binding applying the bind method.
    //@see: {@link http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible }
    module.fn = new(Function.prototype.bind.apply(module.fn, dependencies));

    return module;
};

export default factory;
