import { constructorFunction } from "./constructors/constructorFunction";
import { dependencyDefArr } from "./dependency/dependencyDefArr";
import { IChevronEntry } from "./IChevronEntry";
declare class Chevron {
    readonly $: Map<string, constructorFunction>;
    readonly _: Map<string, IChevronEntry>;
    /**
     * Main Chevron class.
     *
     * @public
     * @class Chevron
     */
    constructor();
    /**
     * Set a new dependency on the dependency container.
     *
     * @public
     * @param {string} id
     * @param {string} type
     * @param {string[]} dependencies
     * @param {*} content
     */
    set(id: string, type: string, dependencies: dependencyDefArr, content: any): void;
    /**
     * Checks if the content map has a dependency.
     *
     * @public
     * @param {string} id
     * @returns {boolean}
     */
    has(id: string): boolean;
    /**
     * Gets a constructed dependency from the content map.
     *
     * @public
     * @param {string} id
     * @returns {*}
     */
    get(id: string): any;
}
export { Chevron };
