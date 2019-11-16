var chevron = (function (exports, lodash) {
    'use strict';

    /**
     * Gets name of a value.
     *
     * If the value has a name or description property, the value of that is returned.
     * If the value is a string, it is returned as is.
     * Otherwise null is returned.
     *
     * @since 10.2.0
     * @memberOf Object
     * @param value Value to check.
     * @returns The name of the value.
     * @example
     * name(class Foo{})
     * // => "Foo"
     *
     * name(function bar(){})
     * // => "bar"
     *
     * name(Symbol("abc"))
     * // => "abc"
     *
     * name("foo")
     * // => "foo"
     *
     * name(1)
     * // => null
     */
    const name = (value) => {
        if (lodash.isString(value)) {
            return value;
        }
        // eslint-disable-next-line no-extra-parens
        if (lodash.isObject(value) && lodash.isString(value.name)) {
            // eslint-disable-next-line no-extra-parens
            return value.name;
        }
        if (lodash.isSymbol(value) && lodash.isString(value.description)) {
            return value.description;
        }
        return null;
    };

    const identityBootstrapper = (initializer) => initializer;

    class Chevron {
        /**
         * Main chevron class.
         *
         * @public
         * @class Chevron
         */
        constructor() {
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
        get(name) {
            return this.resolveEntry(name, new Set());
        }
        /**
         * Checks if the chevron instance has a given injectable.
         *
         * @public
         * @param {*} name Key of the injectable to check.
         * @returns {boolean} If the chevron instance has a given injectable.
         */
        has(name) {
            return this.injectables.has(lodash.isString(name) ? name : this.getKey(name));
        }
        /**
         * Sets a new injectable on the chevron instance.
         *
         * @public
         * @param {*} initializer Content of the injectable.
         * @param {string} bootstrapFn Type of the injectable.
         * @param {string[]} dependencies Array of dependency keys.
         * @param {*?} name? Custom key of the injectable. If none is given, the initializer will be used.
         * @throws Error when the key already exists, or the type is invalid.
         */
        register(initializer, bootstrapFn = identityBootstrapper, dependencies = [], name = null) {
            const key = !lodash.isNil(name) ? name : this.getKey(initializer);
            if (this.injectables.has(key)) {
                throw new Error(`Key already exists: '${key}'.`);
            }
            this.injectables.set(key, {
                bootstrapFn: bootstrapFn,
                dependencies,
                initializer,
                value: null
            });
        }
        resolveEntry(name, resolveStack) {
            const key = lodash.isString(name) ? name : this.getKey(name);
            if (!this.injectables.has(key)) {
                throw new Error(`Injectable '${name}' does not exist.`);
            }
            const entry = this.injectables.get(key);
            if (lodash.isNil(entry.value)) {
                /*
                 * Start bootstrapping value.
                 */
                if (resolveStack.has(key)) {
                    throw new Error(`Circular dependencies found: '${[
                    ...resolveStack,
                    key
                ].join("->")}'.`);
                }
                resolveStack.add(key);
                entry.value = entry.bootstrapFn(entry.initializer, entry.dependencies.map(dependencyName => this.resolveEntry(dependencyName, resolveStack)));
                resolveStack.delete(key);
            }
            return entry.value;
        }
        getKey(initializer) {
            const guessedName = name(initializer);
            if (lodash.isNil(guessedName)) {
                throw new TypeError(`Could not guess name of ${initializer}, please explicitly define one.`);
            }
            return guessedName;
        }
    }

    const classBootstrapper = (initializer, dependencies) => {
        if (!lodash.isFunction(initializer)) {
            throw new TypeError("Non-functions cannot be bootstrapped by this bootstrapper.");
        }
        return Reflect.construct(initializer, dependencies);
    };

    const functionBootstrapper = (initializer, dependencies) => (...args) => {
        if (!lodash.isFunction(initializer)) {
            throw new TypeError("Non-functions cannot be bootstrapped by this bootstrapper.");
        }
        return initializer(...dependencies, ...args);
    };

    /**
     * Decorator function to be used as TypeScript decorator
     * in order to declare a value to be an injectable which is added to the chevron instance.
     *
     * @param {Chevron} instance Chevron instance to use.
     * @param {string[]} dependencies Array of dependency keys.
     */
    const Injectable = (instance, bootstrapFn = identityBootstrapper, dependencies = [], name = null) => (target) => {
        instance.register(target, bootstrapFn, dependencies, name);
        return target;
    };

    /**
     * Decorator function to be used as TypeScript decorator
     * in order to wire an injectable into a class property.
     *
     * @public
     * @param {Chevron} instance Chevron instance to use.
     * @param {*} key Key of the injectable.
     */
    const Autowired = (instance, name) => (target, propertyKey) => {
        target[propertyKey] = instance.get(name);
    };

    exports.Autowired = Autowired;
    exports.Chevron = Chevron;
    exports.Injectable = Injectable;
    exports.classBootstrapper = classBootstrapper;
    exports.functionBootstrapper = functionBootstrapper;
    exports.identityBootstrapper = identityBootstrapper;

    return exports;

}({}, _));
//# sourceMappingURL=chevron.js.map
