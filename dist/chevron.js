var Chevron = function () {
    'use strict';

    const bootstrapDependency = function (_container, dependencyName) {
        const dependency = _container.get(dependencyName);

        if (dependency) {
            return dependency.r ? dependency.c : dependency.i();
        } else {
            throw new Error(`Missing '${dependencyName}'`);
        }
    };

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

    /**
     * Service-type constructor function
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
            //Return function with args injected
            return serviceFn(...dependencies, ...arguments);
        };

        return moduleContent;
    };

    /**
     * Factory-type constructor function
     * @private
     * @param {Function} moduleContent module to be constructed as factory
     * @param {Array} dependencies Array of dependency contents
     * @returns {Object} constructed Factory
     */
    const typeFactory = function (moduleContent, dependencies) {
        //Dereference array, because we dont wanna mutate the arg
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

            //stores type as set with name into instance
            _this[typeName] = function (id, dependencies, fn) {
                _this.set(id, dependencies, fn, constructorFunction);
            };

            return _this;
        }
        /**
         * Defines a new module
         * @param {String} moduleName name of the module
         * @param {Array} dependencies array of dependency names
         * @param {Function} content module content
         * @param {Function} constructorFunction function init the modules with
         * @returns {Chevron} Chevron instance
         */
        set(moduleName, dependencies, content, constructorFunction) {
            const _this = this;
            const _module = {
                c: content,
                r: false
            };

            _module.i = createInit(_this.$, _module, dependencies, constructorFunction);
            _this.$.set(moduleName, _module);

            return _this;
        }
        /**
         * Access and init a module
         * @param {String} moduleName name of the module to access
         * @returns {Mixed} module content
         */
        get(moduleName) {
            const _module = this.$.get(moduleName);

            return _module.r ? _module.c : _module.i();
        }
    };

    return Chevron;
}();