import {constructorFunction} from "./constructors/constructorFunction";
import {factoryConstructorFn} from "./constructors/factoryConstructorFn";
import {serviceConstructorFn} from "./constructors/serviceConstructorFn";
import {dependencyDefArr} from "./dependency/dependencyDefArr";
import {IChevronEntry} from "./IChevronEntry";

class Chevron {
    public readonly $: Map<string, constructorFunction>;
    public readonly _: Map<string, IChevronEntry>;

    /**
     * Main Chevron class.
     *
     * @public
     * @class Chevron
     */
    constructor() {
        // Container map
        this._ = new Map<string, IChevronEntry>();

        // Type map
        this.$ = new Map<string, constructorFunction>([
            ["service", serviceConstructorFn],
            ["factory", factoryConstructorFn]
        ]);
    }

    /**
     * Set a new dependency on the dependency container.
     *
     * @public
     * @param {string} id
     * @param {string} type
     * @param {string[]} dependencies
     * @param {*} content
     */
    public set(
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
     * Checks if the content map has a dependency.
     *
     * @public
     * @param {string} id
     * @returns {boolean}
     */
    public has(id: string): boolean {
        return this._.has(id);
    }

    /**
     * Gets a constructed dependency from the content map.
     *
     * @public
     * @param {string} id
     * @returns {*}
     */
    public get(id: string): any {
        if (!this.has(id)) {
            return null;
        }
        const entry = this._.get(id)!;

        return entry[0] ? entry[1] : entry[2]();
    }
}

export {Chevron};
