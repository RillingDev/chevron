import { bootstrapper } from "./bootstrap/bootstrapper";
declare class Chevron<TValue = any, UInitializer = any> {
    private readonly injectables;
    /**
     * Main chevron class.
     *
     * @public
     * @class Chevron
     */
    constructor();
    /**
     * Gets a bootstrapped injectable from the chevron instance.
     *
     * @public
     * @param {*} key Key of the injectable to get.
     * @returns {*} Bootstrapped content of the injectable.
     * @throws Error when the key cannot be found, or circular dependencies exist.
     */
    get(name: UInitializer | string): TValue;
    /**
     * Checks if the chevron instance has a given injectable.
     *
     * @public
     * @param {*} name Key of the injectable to check.
     * @returns {boolean} If the chevron instance has a given injectable.
     */
    has(name: UInitializer | string): boolean;
    /**
     * Sets a new injectable on the chevron instance.
     *
     * @public
     * @param {*} initializer Content of the injectable.
     * @param {*?} name? Custom key of the injectable. If none is given, the initializer will be used.
     * @param {string} bootstrapFn Type of the injectable.
     * @param {string[]} dependencies Array of dependency keys.
     * @throws Error when the key already exists, or the type is invalid.
     */
    register(initializer: UInitializer, name?: string | null, bootstrapFn?: bootstrapper<TValue, UInitializer, TValue>, dependencies?: string[]): void;
    private resolveEntry;
    private getKey;
}
export { Chevron };
//# sourceMappingURL=Chevron.d.ts.map