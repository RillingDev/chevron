import { isNil, isString } from "lodash";
import { name as getName } from "lightdash";
import { Bootstrappers } from "./bootstrap/Bootstrappers";
import { Scopes } from "./scope/Scopes";
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
class Chevron {
    constructor() {
        this.injectables = new Map();
    }
    registerInjectable(initializer, bootstrapFn = Bootstrappers.IDENTITY, dependencies = [], name = null, scopeFn = Scopes.SINGLETON) {
        const entryName = isString(name) ? name : guessName(initializer);
        if (this.injectables.has(entryName)) {
            throw new Error(`Name already exists: '${entryName}'.`);
        }
        this.injectables.set(entryName, {
            bootstrapFn,
            scopeFn,
            dependencies,
            initializer,
            instances: new Map()
        });
    }
    getInjectableInstance(name, context = null) {
        return this.getBootstrappedInjectableInstance(name, context, new Set());
    }
    hasInjectable(name) {
        return this.injectables.has(getInjectableName(name));
    }
    hasInjectableInstance(name, context = null) {
        const { entry, instanceName } = this.resolveInjectableInstance(name, context);
        return instanceName != null && entry.instances.has(instanceName);
    }
    resolveInjectableInstance(name, context) {
        const entryName = getInjectableName(name);
        if (!this.injectables.has(entryName)) {
            throw new Error(`Injectable '${name}' does not exist.`);
        }
        const entry = this.injectables.get(entryName);
        const instanceName = entry.scopeFn(entryName, entry, context);
        return { entryName, entry, instanceName };
    }
    getBootstrappedInjectableInstance(name, context, resolveStack) {
        const { entryName, entry, instanceName } = this.resolveInjectableInstance(name, context);
        if (instanceName != null && entry.instances.has(instanceName)) {
            return entry.instances.get(instanceName);
        }
        /*
         * Start bootstrapping value.
         */
        if (resolveStack.has(entryName)) {
            throw createCircularDependencyError(entryName, resolveStack);
        }
        resolveStack.add(entryName);
        const instance = entry.bootstrapFn(entry.initializer, entry.dependencies.map(dependencyName => this.getBootstrappedInjectableInstance(dependencyName, context, resolveStack)));
        if (instanceName != null) {
            entry.instances.set(instanceName, instance);
        }
        resolveStack.delete(entryName);
        return instance;
    }
}
export { Chevron };
//# sourceMappingURL=Chevron.js.map