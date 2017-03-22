var Chevron = function () {
    'use strict';

    /**
     * Service-type constructor function
     *
     * @private
     * @param {Function} moduleContent module to be constructed as service
     * @param {Array} dependencies Array of dependency contents
     * @returns {Function} constructed function
     */

    const typeService = function (moduleContent, dependencies) {
        //Dereference fn to avoid unwanted recursion
        const serviceFn = moduleContent;

        moduleContent = function () {
            //Chevron service function wrapper
            //return function with args injected
            return serviceFn(...dependencies, ...arguments);
        };

        return moduleContent;
    };

    /**
     * Factory-type constructor function
     *
     * @private
     * @param {Function} moduleContent module to be constructed as factory
     * @param {Array} dependencies Array of dependency contents
     * @returns {Object} constructed Factory
     */
    const typeFactory = function (moduleContent, dependencies) {
        //dereference array, because we dont wanna mutate the arg
        const dependenciesArr = Array.from(dependencies);
        //First value gets ignored by calling 'new' like this, so we need to fill it with something
        dependenciesArr.unshift(0);

        //Apply into new constructor by binding applying the bind method.
        //@see: {@link http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible }
        moduleContent = new (Function.prototype.bind.apply(moduleContent, dependenciesArr))();

        return moduleContent;
    };

    /**
     * Chevron Class
     * @class
     */
    const Chevron = class {
        /**
         * Chevron Constructor
         * @constructor
         * @returns {Chevron} Chevron instance
         */
        constructor() {
            const _this = this;

            //Instance container
            _this.$ = new Map();

            // Adds default types
            _this.extend("service", typeService);
            _this.extend("factory", typeFactory);
        }
        /**
         * Defines a new module type
         * @param {String} typeName name of the new type
         * @param {Function} constructorFunction function init modules with
         * @returns {Chevron} Chevron instance
         */
        extend(typeName, constructorFunction) {
            const _this = this;

            //stores type as provider with name into instance
            _this[typeName] = function (id, deps, fn) {
                _this.provider(id, deps, fn, constructorFunction);
            };

            return _this;
        }
        /**
         * Defines a new module
         * @param {String} moduleName name of the module
         * @param {Array} deps array of dependency names
         * @param {Function} fn module content
         * @param {Function} constructorFunction function init the modules with
         * @returns {Chevron} Chevron instance
         */
        provider(moduleName, deps, fn, constructorFunction) {
            const _this = this;
            const _module = {
                deps,
                fn,
                rdy: false,
                /**
                 * Inits the module
                 * @returns {Mixed} Module content
                 */
                init: function () {
                    const dependencies = [];

                    //Collects dependencies
                    _module.deps.forEach(depName => {
                        const dependency = _this.$.get(depName);

                        if (dependency) {
                            dependencies.push(dependency.rdy ? dependency.fn : dependency.init());
                        } else {
                            throw new Error(`Missing '${depName}'`);
                        }
                    });

                    //Calls constructorFunction on the module
                    _module.fn = constructorFunction(_module.fn, dependencies);
                    _module.rdy = true;

                    return _module.fn;
                }
            };

            _this.$.set(moduleName, _module);

            return _this;
        }
        /**
         * Access and init a module
         * @param {String} moduleName name of the module to access
         * @returns {Mixed} module content
         */
        access(moduleName) {
            const _module = this.$.get(moduleName);

            return _module.rdy ? _module.fn : _module.init();
        }
    };

    return Chevron;
}();