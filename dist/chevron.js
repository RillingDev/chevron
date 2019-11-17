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
    const name$1 = (value) => {
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

    const singletonScope = (context, injectableEntryName) => `SINGLETON_${injectableEntryName}`;
    const prototypeScope = () => null;
    const DefaultScopes = {
        SINGLETON: singletonScope,
        PROTOTYPE: prototypeScope
    };

    const guessName = (initializer) => {
        const guessedName = name$1(initializer);
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
        /**
         * Registers a new injectable on this container.
         *
         * @param initializer Initial value of this injectable. This can be any value, but usually  a class or a different kind of function.
         *      During retrieval, the initial value might be transformed by the bootstrapper (see {@link Bootstrapping} for details).
         *      If no name is provided in the options (see description of the options parameter, section "name"),
         *      a name will be determined from the initializer through {@link getName}.
         * @param dependencies Definitions of this injectables dependencies. Values can be either plain strings ("MyOtherService"),
         *      or a value which is nameable. For details on nameable values see {@link getName}.
         * @param options Options for this injectable. The following options exist:
         *      <ul>
         *          <li>name:
         *                  Name for this injectable. If this is not provided, the name will be determined based on the initializer.
         *                  (see description of the initializer parameter)
         *          </li>
         *          <li>bootstrapping:
         *                  Bootstrapping strategy to use when instantiating this injectable (see {@link Bootstrapping} for details).
         *                  By default, {@link DefaultBootstrappings.IDENTITY} is used. If your injectable is a class or factory function,
         *                  consider using {@link DefaultBootstrappings.CLASS} or {@link DefaultBootstrappings.FUNCTION} instead respectively,
         *                  or provide your own.
         *          </li>
         *          <li>scope:
         *                  Scoping strategy to use when retrieving instances (see {@link Scope} for details).
         *                  By default, {@link DefaultScopes.SINGLETON} is used. For different use cases,
         *                  see {@link DefaultScopes.PROTOTYPE} or provide your own.
         *          </li>
         *      </ul>
         * @throws Error when an injectable with the requested name is already registered.
         * @throws TypeError when no name can be determined for this injectable or any of its dependencies.
         */
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
                initializer,
                bootstrapping,
                scope,
                dependencies: dependencies.map(getInjectableName),
                instances: new Map()
            });
        }
        /**
         * Checks if an injectable with the name provided is registered for this container, regardless if its instantiated or not.
         * To check if an injectable is registered and instantiated, see {@link #hasInjectableInstance}.
         *
         * @param name Either a raw string name or a nameable value that should be checked for. See {@link #registerInjectable} for details.
         * @return if an injectable with the name provided is registered on this container.
         * @throws TypeError when no name can be determined for the provided nameable.
         */
        hasInjectable(name) {
            return this.injectables.has(getInjectableName(name));
        }
        /**
         * Checks if an injectable with the name provided is registered and instantiated for this container.
         * To check if an injectable is registered without checking for instantiation, see {@link #hasInjectable}.
         *
         * @param name Either a raw string name or a nameable value that should be checked for. See {@link #registerInjectable} for details.
         * @param context Context to be used for instance checks. See {@link Scope} for details.
         * @return if an injectable with the name provided is registered and instantiated on this container.
         * @throws TypeError when no name can be determined for the provided nameable.
         */
        hasInjectableInstance(name, context = null) {
            if (!this.hasInjectable(name)) {
                return false;
            }
            const { injectableEntry, instanceName } = this.resolveInjectableInstance(getInjectableName(name), context);
            return (instanceName != null && injectableEntry.instances.has(instanceName));
        }
        /**
         * Retrieves an instantiated injectable, recursively instantiating dependencies if they were not instantiated before.
         *
         * @param name Either a raw string name or a nameable value that should be retrieved. See {@link #registerInjectable} for details.
         * @param context Context to be used for instance checks. See {@link Scope} for details.
         * @return instantiated injectable for the given name.
         * @throws TypeError when no name can be determined for the provided nameable.
         * @throws Error when a dependency cannot be found.
         * @throws Error when recursive dependencies are detected.
         */
        getInjectableInstance(name, context = null) {
            return this.getBootstrappedInjectableInstance(getInjectableName(name), context, new Set());
        }
        resolveInjectableInstance(injectableEntryName, context) {
            if (!this.injectables.has(injectableEntryName)) {
                throw new Error(`Injectable '${name}' does not exist.`);
            }
            const injectableEntry = this.injectables.get(injectableEntryName);
            const instanceName = injectableEntry.scope(context, injectableEntryName, injectableEntry);
            return {
                injectableEntry,
                instanceName
            };
        }
        getBootstrappedInjectableInstance(injectableEntryName, context, resolveStack) {
            const { injectableEntry, instanceName } = this.resolveInjectableInstance(injectableEntryName, context);
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
            const bootstrappedDependencies = injectableEntry.dependencies.map(dependencyName => this.getBootstrappedInjectableInstance(dependencyName, context, resolveStack));
            const instance = injectableEntry.bootstrapping(injectableEntry.initializer, bootstrappedDependencies, injectableEntryName, injectableEntry);
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
