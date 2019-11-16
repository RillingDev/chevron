import { isNil, isString } from "lodash";
import { name as getName } from "lightdash";
import { identityBootstrapper } from "./bootstrap/identityBootstrapper";
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
        return this.injectables.has(isString(name) ? name : this.getKey(name));
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