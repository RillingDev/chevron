import typeService from "./types/service";
import typeFactory from "./types/factory";

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
