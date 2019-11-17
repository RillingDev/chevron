import { isNil, isString } from "lodash";
import { name as getName } from "lightdash";
import { DefaultBootstrappers } from "./bootstrap/DefaultBootstrappers";
class Chevron {
    constructor() {
        this.injectables = new Map();
    }
    get(name) {
        return this.resolveEntry(name, new Set());
    }
    has(name) {
        return this.injectables.has(isString(name) ? name : this.getKey(name));
    }
    register(initializer, bootstrapFn = DefaultBootstrappers.IDENTITY, dependencies = [], name = null) {
        const key = !isNil(name) ? name : this.getKey(initializer);
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
        const key = isString(name) ? name : this.getKey(name);
        if (!this.injectables.has(key)) {
            throw new Error(`Injectable '${name}' does not exist.`);
        }
        const entry = this.injectables.get(key);
        if (isNil(entry.value)) {
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
        const guessedName = getName(initializer);
        if (isNil(guessedName)) {
            throw new TypeError(`Could not guess name of ${initializer}, please explicitly define one.`);
        }
        return guessedName;
    }
}
export { Chevron };
//# sourceMappingURL=Chevron.js.map