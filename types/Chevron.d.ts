import { dependencyDefinitionArr } from "./dependencyDefinitionArr";
import { typeBootstrapperFn } from "./injectableTypes/typeBootstrapperFn";
declare class Chevron {
    private readonly types;
    private readonly injectables;
    /**
     * Main Chevron class.
     *
     * @public
     * @class Chevron
     */
    constructor();
    /**
     * Set a new injectable on the chevron instance.
     *
     * @public
     * @param {string} name
     * @param {string} type
     * @param {string[]} dependencies
     * @param {*} content
     */
    set(name: string, type: string, dependencies: dependencyDefinitionArr, content: any): void;
    /**
     * Checks if the chevron instance has a given injectable.
     *
     * @public
     * @param {string} name
     * @returns {boolean}
     */
    has(name: string): boolean;
    /**
     * Gets a bootstrapped injectable from the chevron instance.
     *
     * @public
     * @param {string} name
     * @returns {*}
     */
    get(name: string): any;
    setType(name: string, bootstrapperFn: typeBootstrapperFn): void;
    hasType(name: string): boolean;
    private createEntry;
    private resolveEntry;
}
export { Chevron };
