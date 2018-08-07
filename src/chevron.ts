import { factoryConstructorFn } from "./constructors/factory";
import { serviceConstructorFn } from "./constructors/service";

type dependencyDefArr = string[];
type dependencyArr = any[];
type constructorFunction = (
    content: any,
    dependencies: dependencyDefArr
) => any;

interface IChevronEntry extends Array<any> {
    [0]: boolean; // State of construction
    [1]: any; // Content
    [2]?: () => any; // Constructor
}

const Chevron = class {
    public readonly $: Map<string, constructorFunction>;
    public readonly _: Map<string, IChevronEntry>;

    /**
     * Main Chevron class.
     *
     * @public
     * @class Chevron
     */
    constructor() {
        // Type map
        this.$ = new Map<string, constructorFunction>();
        // Content map
        this._ = new Map<string, IChevronEntry>();

        this.$.set("service", serviceConstructorFn);
        this.$.set("factory", factoryConstructorFn);
    }

    /**
     * Set a new entry on the content map.
     *
     * @public
     * @param {string} id
     * @param {string} type
     * @param {string[]} dependencies
     * @param {*} content
     */
    set(
        id: string,
        type: string,
        dependencies: dependencyDefArr,
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

    /**
     * Checks if the content map has an entry.
     *
     * @public
     * @param {string} id
     * @returns {boolean}
     */
    has(id: string): boolean {
        return this._.has(id);
    }

    /**
     * Gets an entry from the content map.
     *
     * @public
     * @param id {string} id
     * @returns {*}
     */
    get(id: string): any {
        if (!this.has(id)) {
            return null;
        }
        const entry = <IChevronEntry>this._.get(id);

        return entry[0] ? entry[1] : entry[2]!();
    }
};

export {
    Chevron,
    IChevronEntry,
    constructorFunction,
    dependencyArr,
    dependencyDefArr
};
