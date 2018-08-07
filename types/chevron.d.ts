declare type dependencyDefArr = string[];
declare type dependencyArr = any[];
declare type constructorFunction = (content: any, dependencies: dependencyDefArr) => any;
interface IChevronEntry extends Array<any> {
    [0]: boolean;
    [1]: any;
    [2]?: () => any;
}
declare const Chevron: {
    new (): {
        readonly $: Map<string, constructorFunction>;
        readonly _: Map<string, IChevronEntry>;
        /**
         * Set a new entry on the content map.
         *
         * @public
         * @param {string} id
         * @param {string} type
         * @param {string[]} dependencies
         * @param {*} content
         */
        set(id: string, type: string, dependencies: string[], content: any): void;
        /**
         * Checks if the content map has an entry.
         *
         * @public
         * @param {string} id
         * @returns {boolean}
         */
        has(id: string): boolean;
        /**
         * Gets an entry from the content map.
         *
         * @public
         * @param id {string} id
         * @returns {*}
         */
        get(id: string): any;
    };
};
export { Chevron, IChevronEntry, constructorFunction, dependencyArr, dependencyDefArr };
