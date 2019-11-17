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

    const createNonFunctionInitializerError = () => new TypeError("Non-functions cannot be bootstrapped by this bootstrapper.");
    const classBootstrapper = (initializer, dependencies) => {
        if (!lodash.isFunction(initializer)) {
            throw createNonFunctionInitializerError();
        }
        return Reflect.construct(initializer, dependencies);
    };
    const functionBootstrapper = (initializer, dependencies) => (...args) => {
        if (!lodash.isFunction(initializer)) {
            throw createNonFunctionInitializerError();
        }
        return initializer(...dependencies, ...args);
    };
    const identityBootstrapper = (initializer) => initializer;
    const Bootstrappers = {
        CLASS: classBootstrapper,
        FUNCTION: functionBootstrapper,
        IDENTITY: identityBootstrapper
    };

    const singletonScoper = (name) => `SINGLETON_${name}`;
    const Scopes = {
        SINGLETON: singletonScoper
    };

    class Chevron {
        constructor() {
            this.injectables = new Map();
        }
        get(name, context = null) {
            return this.resolveEntry(name, context, new Set());
        }
        has(name) {
            return this.injectables.has(lodash.isString(name) ? name : this.getKey(name));
        }
        register(initializer, bootstrapFn = Bootstrappers.IDENTITY, dependencies = [], name = null, scopeFn = Scopes.SINGLETON) {
            const key = !lodash.isNil(name) ? name : this.getKey(initializer);
            if (this.injectables.has(key)) {
                throw new Error(`Key already exists: '${key}'.`);
            }
            this.injectables.set(key, {
                bootstrapFn,
                scopeFn,
                dependencies,
                initializer,
                instances: new Map()
            });
        }
        resolveEntry(name, context, resolveStack) {
            const entryName = lodash.isString(name) ? name : this.getKey(name);
            if (!this.injectables.has(entryName)) {
                throw new Error(`Injectable '${name}' does not exist.`);
            }
            const entry = this.injectables.get(entryName);
            const instanceName = entry.scopeFn(entryName, entry, context);
            if (!entry.instances.has(instanceName)) {
                /*
                 * Start bootstrapping value.
                 */
                if (resolveStack.has(entryName)) {
                    throw new Error(`Circular dependencies found: '${[
                    ...resolveStack,
                    entryName
                ].join("->")}'.`);
                }
                resolveStack.add(entryName);
                const instance = entry.bootstrapFn(entry.initializer, entry.dependencies.map(dependencyName => this.resolveEntry(dependencyName, context, resolveStack)));
                entry.instances.set(instanceName, instance);
                resolveStack.delete(entryName);
            }
            return entry.instances.get(instanceName);
        }
        getKey(initializer) {
            const guessedName = name(initializer);
            if (lodash.isNil(guessedName)) {
                throw new TypeError(`Could not guess name of ${initializer}, please explicitly define one.`);
            }
            return guessedName;
        }
    }

    const Injectable = (instance, bootstrapFn = Bootstrappers.IDENTITY, dependencies = [], name = null, scopeFn = Scopes.SINGLETON) => (target) => {
        instance.register(target, bootstrapFn, dependencies, name, scopeFn);
        return target;
    };

    const Autowired = (instance, name, context = null) => (target, propertyKey) => {
        target[propertyKey] = instance.get(name, context);
    };

    exports.Autowired = Autowired;
    exports.Bootstrappers = Bootstrappers;
    exports.Chevron = Chevron;
    exports.Injectable = Injectable;
    exports.Scopes = Scopes;

    return exports;

}({}, _));
//# sourceMappingURL=chevron.js.map
