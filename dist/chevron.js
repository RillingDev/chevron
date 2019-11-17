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
    const classBootstrapping = (initializer, dependencies) => {
        if (!lodash.isFunction(initializer)) {
            throw createNonFunctionInitializerError();
        }
        return Reflect.construct(initializer, dependencies);
    };
    const functionBootstrapping = (initializer, dependencies) => (...args) => {
        if (!lodash.isFunction(initializer)) {
            throw createNonFunctionInitializerError();
        }
        return initializer(...dependencies, ...args);
    };
    const identityBootstrapping = (initializer) => initializer;
    const DefaultBootstrappings = {
        CLASS: classBootstrapping,
        FUNCTION: functionBootstrapping,
        IDENTITY: identityBootstrapping
    };

    const singletonScope = (name) => `SINGLETON_${name}`;
    const prototypeScope = () => null;
    const DefaultScopes = {
        SINGLETON: singletonScope,
        PROTOTYPE: prototypeScope
    };

    const guessName = (initializer) => {
        const guessedName = name(initializer);
        if (lodash.isNil(guessedName)) {
            throw new TypeError(`Could not guess name of ${initializer}, please explicitly define one.`);
        }
        return guessedName;
    };
    const getInjectableName = (name) => lodash.isString(name) ? name : guessName(name);
    const createCircularDependencyError = (entryName, resolveStack) => {
        return new Error(`Circular dependencies found: '${[...resolveStack, entryName].join("->")}'.`);
    };
    /**
     * Injectable container class.
     *
     * @class
     */
    class Chevron {
        constructor() {
            this.injectables = new Map();
        }
        registerInjectable(initializer, dependencies, options = {}) {
            const { bootstrapping, scope, name } = lodash.defaults(options, {
                bootstrapping: DefaultBootstrappings.IDENTITY,
                scope: DefaultScopes.SINGLETON,
                name: null
            });
            const injectableEntryName = !lodash.isNil(name)
                ? name
                : guessName(initializer);
            if (this.injectables.has(injectableEntryName)) {
                throw new Error(`Name already exists: '${injectableEntryName}'.`);
            }
            this.injectables.set(injectableEntryName, {
                bootstrapping,
                scope,
                dependencies,
                initializer,
                instances: new Map()
            });
        }
        hasInjectable(name) {
            return this.injectables.has(getInjectableName(name));
        }
        hasInjectableInstance(name, context = null) {
            const { injectableEntry, instanceName } = this.resolveInjectableInstance(name, context);
            return (instanceName != null && injectableEntry.instances.has(instanceName));
        }
        getInjectableInstance(name, context = null) {
            return this.getBootstrappedInjectableInstance(name, context, new Set());
        }
        resolveInjectableInstance(name, context) {
            const injectableEntryName = getInjectableName(name);
            if (!this.injectables.has(injectableEntryName)) {
                throw new Error(`Injectable '${name}' does not exist.`);
            }
            const injectableEntry = this.injectables.get(injectableEntryName);
            const instanceName = injectableEntry.scope(injectableEntryName, injectableEntry, context);
            return {
                injectableEntryName: injectableEntryName,
                injectableEntry,
                instanceName
            };
        }
        getBootstrappedInjectableInstance(name, context, resolveStack) {
            const { injectableEntryName, injectableEntry, instanceName } = this.resolveInjectableInstance(name, context);
            if (instanceName != null &&
                injectableEntry.instances.has(instanceName)) {
                return injectableEntry.instances.get(instanceName);
            }
            /*
             * Start bootstrapping value.
             */
            if (resolveStack.has(injectableEntryName)) {
                throw createCircularDependencyError(injectableEntryName, resolveStack);
            }
            resolveStack.add(injectableEntryName);
            const instance = injectableEntry.bootstrapping(injectableEntry.initializer, injectableEntry.dependencies.map(dependencyName => this.getBootstrappedInjectableInstance(dependencyName, context, resolveStack)));
            if (instanceName != null) {
                injectableEntry.instances.set(instanceName, instance);
            }
            resolveStack.delete(injectableEntryName);
            return instance;
        }
    }

    const Injectable = (instance, dependencies, options = {}) => (target) => {
        instance.registerInjectable(target, dependencies, options);
        return target;
    };

    const Autowired = (instance, name, context = null) => (target, propertyKey) => {
        target[propertyKey] = instance.getInjectableInstance(name, context);
    };

    exports.Autowired = Autowired;
    exports.Chevron = Chevron;
    exports.DefaultBootstrappings = DefaultBootstrappings;
    exports.DefaultScopes = DefaultScopes;
    exports.Injectable = Injectable;

    return exports;

}({}, _));
//# sourceMappingURL=chevron.js.map
