/**
 * Service-type constructor function
 *
 * @private
 * @param {Function} moduleContent module to be constructed as service
 * @param {Array<any>} dependencies Array of dependency contents
 * @returns {Function} constructed function
 */
const typeService = function(moduleContent, dependencies) {
    //Dereference fn to avoid unwanted recursion
    const serviceFn = moduleContent;

    moduleContent = function() {
        //Chevron service function wrapper
        //Return function with args injected
        return serviceFn(...dependencies, ...arguments);
    };

    return moduleContent;
};

/**
 * Factory-type constructor function
 *
 * @private
 * @param {Function} moduleContent module to be constructed as factory
 * @param {Array<any>} dependencies Array of dependency contents
 * @returns {Object} constructed Factory
 */
const typeFactory = function(moduleContent, dependencies) {
    //Dereference array, because we dont wanna mutate the arg
    const dependenciesArr = Array.from(dependencies);
    //First value gets ignored by calling 'new' like this, so we need to fill it with something
    dependenciesArr.unshift(0);

    //Apply into new constructor by binding applying the bind method.
    //@see: {@link http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible }
    moduleContent = new (Function.prototype.bind.apply(
        moduleContent,
        dependenciesArr
    ))();

    return moduleContent;
};

/**
 * Chevron Class
 *
 * @class
 */
const Chevron = class {
    /**
     * Chevron Constructor
     *
     * @constructor
     * @returns {Chevron} Chevron instance
     */
    constructor() {
        //Instance container
        this.$ = new Map();

        // Adds default types
        this.extend("service", typeService);
        this.extend("factory", typeFactory);
    }
    /**
     * Defines a new module type
     *
     * @param {string} typeName name of the new type
     * @param {Function} constructorFunction function init modules with
     * @returns {Chevron} Chevron instance
     */
    extend(typeName, constructorFunction) {
        //stores type as set with name into instance
        this[typeName] = (id, dependencies, fn) => this.set(id, dependencies, fn, constructorFunction);

        return this;
    }
    /**
     * Defines a new module
     *
     * @param {string} moduleName name of the module
     * @param {Array<string>} dependencies array of dependency names
     * @param {Function} content module content
     * @param {Function} constructorFunction function init the modules with
     * @returns {Chevron} Chevron instance
     *
     * Internal Module structure:
     * [ready<boolean>,content<mixed>,init<fn>]
     */
    set(moduleName, dependencies, content, constructorFunction) {
        const _module = [false, content];

        //Add init-fn
        _module.push(() => {
            const constructedDependencies = dependencies.map(dependencyName => this.get(dependencyName));

            //Calls constructorFunction on the module
            _module[1] = constructorFunction(_module[1], constructedDependencies);
            _module[0] = true;

            return _module[1];
        });

        this.$.set(moduleName, _module);

        return this;
    }
    /**
     * Access and init a module
     *
     * @param {string} moduleName name of the module to access
     * @returns {any} module content
     */
    get(moduleName) {
        if (this.$.has(moduleName)) {
            const dependency = this.$.get(moduleName);

            return dependency[0] ? dependency[1] : dependency[2]();
        } else {
            throw new Error(`Missing '${moduleName}'`);
        }
    }
};

export default Chevron;
