"use strict";

/**
 * Constructor function for the factory module type
 * @private
 * @param {Object} _module The module object
 * @param {Array} dependencies Array of dependencies
 * @returns {Mixed} Initialized module
 */
const factory = function (_module, dependencies) {
    //First value gets ignored by calling 'new' like this, so we need to fill it with something
    dependencies.unshift(0);

    //Apply into new constructor by binding applying the bind method.
    //@see: {@link http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible }
    _module.fn = new(Function.prototype.bind.apply(_module.fn, dependencies));

    return _module;
};

export default factory;
