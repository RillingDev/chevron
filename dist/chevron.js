var chevron = (function (exports, lodash) {
    'use strict';

    /**
     * Built-in factory bootstrapper.
     *
     * @private
     */
    const factoryBootstrapper = (initializer, dependencies) => Reflect.construct(initializer, dependencies);

    (function (InjectableType) {
        InjectableType["FACTORY"] = "factory";
        InjectableType["SERVICE"] = "service";
        InjectableType["PLAIN"] = "plain";
    })(exports.InjectableType || (exports.InjectableType = {}));

    /**
     * Built-in plain bootstrapper.
     *
     * @private
     */
    const plainBootstrapper = (initializer) => initializer;

    /**
     * Built-in service bootstrapper.
     *
     * @private
     */
    const serviceBootstrapper = (initializer, dependencies) => 
    // tslint:disable-next-line:only-arrow-functions
    function () {
        return initializer(...dependencies, ...arguments);
    };

    class Chevron {
        /**
         * Main chevron class.
         *
         * @public
         * @class Chevron
         */
        constructor() {
            this.types = new Map();
            this.setType(exports.InjectableType.PLAIN, plainBootstrapper);
            this.setType(exports.InjectableType.SERVICE, serviceBootstrapper);
            this.setType(exports.InjectableType.FACTORY, factoryBootstrapper);
            this.injectables = new Map();
        }
        /**
         * Gets a bootstrapped injectable from the chevron instance.
         *
         * @public
         * @param {*} key Key of the injectable to get.
         * @returns {*} Bootstrapped content of the injectable.
         * @throws Error when the key cannot be found, or circular dependencies exist.
         */
        get(key) {
            return this.resolveEntry(key, new Set());
        }
        /**
         * Checks if the chevron instance has a given injectable.
         *
         * @public
         * @param {*} key Key of the injectable to check.
         * @returns {boolean} If the chevron instance has a given injectable.
         */
        has(key) {
            return this.injectables.has(key);
        }
        /**
         * Sets a new injectable on the chevron instance.
         *
         * @public
         * @param {string} type Type of the injectable.
         * @param {string[]} dependencies Array of dependency keys.
         * @param {*} initializer Content of the injectable.
         * @param {*?} key Custom key of the injectable. If none is given, the initializer will be used.
         * @throws Error when the key already exists, or the type is invalid.
         */
        set(type, dependencies, initializer, key) {
            if (!this.hasType(type)) {
                throw new Error(`Missing type '${type}'.`);
            }
            /*
             * Infer the key from the initializer only if no key was explicitly given.
             */
            const effectiveKey = lodash.isNil(key) ? initializer : key;
            if (this.has(effectiveKey)) {
                throw new Error(`Key already exists: '${effectiveKey}'.`);
            }
            this.injectables.set(effectiveKey, {
                typeBootstrapper: this.types.get(type),
                dependencies,
                initializer,
                content: null
            });
        }
        /**
         * Checks if the chevron instance has a given injectable type.
         *
         * @public
         * @param {string} name Name of the injectable type to check.
         * @returns {boolean} If the chevron instance has a given injectable type.
         */
        hasType(name) {
            return this.types.has(name);
        }
        /**
         * Sets a type of injectables.
         *
         * @public
         * @param {string} name Name of the type.
         * @param {function} bootstrapperFn Bootstrap function for injectables of this type.
         */
        setType(name, bootstrapperFn) {
            this.types.set(name, bootstrapperFn);
        }
        /**
         * Resolves an entry by its key, keeping track of the access stack.
         *
         * @private
         */
        resolveEntry(key, accessStack) {
            if (!this.has(key)) {
                throw new Error(`Injectable '${key}' does not exist.`);
            }
            const entry = this.injectables.get(key);
            if (lodash.isNil(entry.content)) {
                /*
                 * Entry is not constructed, recursively bootstrap dependencies and the entry itself.
                 */
                this.bootstrap(key, accessStack, entry);
            }
            return entry.content;
        }
        /**
         * Bootstraps an entry, keeping track of the access stack.
         *
         * @private
         */
        bootstrap(key, accessStack, entry) {
            /*
             * Check if we already tried accessing this injectable before; if we did, assume circular dependencies.
             */
            if (accessStack.has(key)) {
                throw new Error(`Circular dependencies found: '${[...accessStack, key].join("->")}'.`);
            }
            accessStack.add(key);
            entry.content = entry.typeBootstrapper(entry.initializer, entry.dependencies.map(dependencyName => this.resolveEntry(dependencyName, accessStack)));
            accessStack.delete(key);
        }
    }

    /**
     * Decorator function to be used as TypeScript decorator
     * in order to wire an injectable into a class property.
     *
     * @public
     * @param {Chevron} instance Chevron instance to use.
     * @param {*} key Key of the injectable.
     */
    const Autowired = (instance, key) => (target, propertyKey) => {
        target[propertyKey] = instance.get(key);
    };

    /**
     * Decorator function to be used as TypeScript decorator
     * in order to declare a value to be an injectable which is added to the chevron instance.
     *
     * @param {Chevron} instance Chevron instance to use.
     * @param {string} type Type of the injectable.
     * @param {string[]} dependencies Array of dependency keys.
     * @param {*?} key Custom key of the injectable. If none is given, the initializer will be used.
     */
    const Injectable = (instance, type, dependencies, key) => (target) => {
        instance.set(type, dependencies, target, key);
        return target;
    };

    exports.Autowired = Autowired;
    exports.Chevron = Chevron;
    exports.Injectable = Injectable;

    return exports;

}({}, _));
//# sourceMappingURL=chevron.js.map
