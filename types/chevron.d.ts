declare type constructorFunction = (content: any, dependencies: dependencyArr) => any;
declare type dependencyArr = string[];
interface IChevronEntry extends Array<any> {
    [0]: boolean;
    [1]: any;
    [2]?: () => any;
}
declare const Chevron: {
    new (): {
        readonly $: Map<string, constructorFunction>;
        readonly _: Map<string, IChevronEntry>;
        set(id: string, type: string, dependencies: string[], content: any): void;
        get(id: string): any;
    };
};
export { Chevron, IChevronEntry, constructorFunction, dependencyArr };
