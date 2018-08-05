import { factoryConstructorFn } from "./constructors/factory";
import { serviceConstructorFn } from "./constructors/service";

type constructorFunction = (content: any, dependencies: dependencyArr) => any;
type dependencyArr = string[];

interface IChevronEntry extends Array<any> {
    [0]: boolean; // State of construction
    [1]: any; // Content
    [2]?: () => any; // Constructor
}

const Chevron = class {
    public readonly $: Map<string, constructorFunction>;
    public readonly _: Map<string, IChevronEntry>;

    constructor() {
        // Type map
        this.$ = new Map<string, constructorFunction>();
        // Content map
        this._ = new Map<string, IChevronEntry>();

        this.$.set("service", serviceConstructorFn);
        this.$.set("factory", factoryConstructorFn);
    }
    set(
        id: string,
        type: string,
        dependencies: dependencyArr,
        content: any
    ): void {
        if (!this.$.has(type)) {
            throw new Error(`Missing type '${type}'.`);
        }

        const entry: IChevronEntry = [
            false,
            content,
            () => {
                const dependenciesConstructed = dependencies.map(
                    dependencyName => this.get(dependencyName)
                );

                entry[1] = this.$.get(type)!(entry[1], dependenciesConstructed);
                entry[0] = true;

                return entry[1];
            }
        ];

        this._.set(id, entry);
    }
    get(id: string): any {
        if (!this._.has(id)) {
            throw new Error(`Missing entry '${id}'.`);
        }
        const entry = <IChevronEntry>this._.get(id);

        return entry[0] ? entry[1] : entry[2]!();
    }
};

export { Chevron, IChevronEntry, constructorFunction, dependencyArr };
