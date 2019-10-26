import { DependencyKeyArr } from "./DependencyKeyArr";
import { TypeBootstrapperFn } from "./injectableTypes/TypeBootstrapperFn";
declare class Chevron {
    private readonly types;
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
    get(key: any): any;
    /**
     * Checks if the chevron instance has a given injectable.
     *
     * @public
     * @param {*} key Key of the injectable to check.
     * @returns {boolean} If the chevron instance has a given injectable.
     */
    has(key: any): boolean;
    /**
     * Sets a new injectable on the chevron instance.
     *
     * @public
     * @param {string} type Type of the injectable.
     * @param {string[]} dependencies Array of dependency keys.
     * @param {*} initializer Content of the injectable.
     * @param {*?} key Custom key of the injectable. If none is given, the initializer will be used.
     * @throws Error when the key already exists, or the type is invalid.
     */
    set(type: string, dependencies: DependencyKeyArr, initializer: any, key?: any): void;
    /**
     * Checks if the chevron instance has a given injectable type.
     *
     * @public
     * @param {string} name Name of the injectable type to check.
     * @returns {boolean} If the chevron instance has a given injectable type.
     */
    hasType(name: string): boolean;
    /**
     * Sets a type of injectables.
     *
     * @public
     * @param {string} name Name of the type.
     * @param {function} bootstrapperFn Bootstrap function for injectables of this type.
     */
    setType(name: string, bootstrapperFn: TypeBootstrapperFn): void;
    /**
     * Resolves an entry by its key, keeping track of the access stack.
     *
     * @private
     */
    private resolveEntry;
    /**
     * Bootstraps an entry, keeping track of the access stack.
     *
     * @private
     */
    private bootstrap;
}
export { Chevron };
//# sourceMappingURL=Chevron.d.ts.map