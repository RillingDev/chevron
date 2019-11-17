import { defaults, isNil, isString } from "lodash";
import { name as getName } from "lightdash";
import { DefaultBootstrappings } from "./bootstrap/DefaultBootstrappings";
import { DefaultScopes } from "./scope/DefaultScopes";
const guessName = (initializer) => {
    const guessedName = getName(initializer);
    if (isNil(guessedName)) {
        throw new TypeError(`Could not guess name of ${initializer}, please explicitly define one.`);
    }
    return guessedName;
};
const getInjectableName = (name) => isString(name) ? name : guessName(name);
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
        const { bootstrapping, scope, name } = defaults(options, {
            bootstrapping: DefaultBootstrappings.IDENTITY,
            scope: DefaultScopes.SINGLETON,
            name: null
        });
        const injectableEntryName = !isNil(name)
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
        const instanceName = injectableEntry.scope(context, injectableEntryName, injectableEntry);
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
        const bootstrappedDependencies = injectableEntry.dependencies.map(dependencyName => this.getBootstrappedInjectableInstance(dependencyName, context, resolveStack));
        const instance = injectableEntry.bootstrapping(injectableEntry.initializer, bootstrappedDependencies, injectableEntryName, injectableEntry);
        if (instanceName != null) {
            injectableEntry.instances.set(instanceName, instance);
        }
        resolveStack.delete(injectableEntryName);
        return instance;
    }
}
export { Chevron };
//# sourceMappingURL=Chevron.js.map