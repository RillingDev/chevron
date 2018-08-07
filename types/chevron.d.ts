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
         * Set a new dependency on the dependency container.
         *
         * @public
         * @param {string} id
         * @param {string} type
         * @param {string[]} dependencies
         * @param {*} content
         */
        set(id: string, type: string, dependencies: string[], content: any): void;
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
    };
};
export { Chevron, IChevronEntry, constructorFunction, dependencyArr, dependencyDefArr };
