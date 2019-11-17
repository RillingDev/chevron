import { isNil, isString } from "lodash";
import { name as getName } from "lightdash";
import { Bootstrappers } from "./bootstrap/Bootstrappers";
import { Scopes } from "./scope/Scopes";
class Chevron {
    constructor() {
        this.injectables = new Map();
    }
    get(name, context = null) {
        return this.resolveEntry(name, context, new Set());
    }
    has(name) {
        return this.injectables.has(isString(name) ? name : this.getKey(name));
    }
    register(initializer, bootstrapFn = Bootstrappers.IDENTITY, dependencies = [], name = null, scopeFn = Scopes.SINGLETON) {
        const key = !isNil(name) ? name : this.getKey(initializer);
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
        const entryName = isString(name) ? name : this.getKey(name);
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
        const guessedName = getName(initializer);
        if (isNil(guessedName)) {
            throw new TypeError(`Could not guess name of ${initializer}, please explicitly define one.`);
        }
        return guessedName;
    }
}
export { Chevron };
//# sourceMappingURL=Chevron.js.map