import { dependencyDefinitionArr } from "./dependencyDefinitionArr";
import { typeBootstrapperFn } from "./injectableTypes/typeBootstrapperFn";
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
     * @param {string} name Name of the injectable to get.
     * @returns {*} Bootstrapped content of the injectable.
     * @throws Error when the name cannot be found, or circular dependencies exist.
     */
    get(name: string): any;
    /**
     * Checks if the chevron instance has a given injectable.
     *
     * @public
     * @param {string} name Name of the injectable to check.
     * @returns {boolean} If the chevron instance has a given injectable.
     */
    has(name: string): boolean;
    /**
     * Set a new injectable on the chevron instance.
     *
     * @public
     * @param {string} name Name of the injectable.
     * @param {string} type Type of the injectable.
     * @param {string[]} dependencies Array of dependency names.
     * @param {*} content Content of the injectable.
     */
    set(name: string, type: string, dependencies: dependencyDefinitionArr, content: any): void;
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
    setType(name: string, bootstrapperFn: typeBootstrapperFn): void;
    private resolveEntry;
    private createEntry;
}
export { Chevron };
