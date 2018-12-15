import { dependencyDefinitionArr } from "./dependencyDefinitionArr";
import { IEntry } from "./IEntry";
import { factoryBootstrapper } from "./injectableTypes/factory";
import { InjectableType } from "./injectableTypes/InjectableType";
import { plainBootstrapper } from "./injectableTypes/plain";
import { serviceBootstrapper } from "./injectableTypes/service";
import { typeBootstrapperFn } from "./injectableTypes/typeBootstrapperFn";

class Chevron {
    private readonly types: Map<string, typeBootstrapperFn>;
    private readonly injectables: Map<string, IEntry>;

    /**
     * Main Chevron class.
     *
     * @public
     * @class Chevron
     */
    constructor() {
        this.types = new Map();
        this.setType(InjectableType.SERVICE, serviceBootstrapper);
        this.setType(InjectableType.FACTORY, factoryBootstrapper);
        this.setType(InjectableType.PLAIN, plainBootstrapper);

        this.injectables = new Map();
    }

    /**
     * Set a new injectable on the chevron instance.
     *
     * @public
     * @param {string} name
     * @param {string} type
     * @param {string[]} dependencies
     * @param {*} content
     */
    public set(
        name: string,
        type: string,
        dependencies: dependencyDefinitionArr,
        content: any
    ): void {
        this.injectables.set(
            name,
            this.createEntry(type, content, dependencies)
        );
    }

    /**
     * Checks if the chevron instance has a given injectable.
     *
     * @public
     * @param {string} name
     * @returns {boolean}
     */
    public has(name: string): boolean {
        return this.injectables.has(name);
    }

    /**
     * Gets a bootstrapped injectable from the chevron instance.
     *
     * @public
     * @param {string} name
     * @returns {*}
     */
    public get(name: string): any {
        return this.resolveEntry(name, new Set());
    }

    public setType(name: string, bootstrapperFn: typeBootstrapperFn): void {
        this.types.set(name, bootstrapperFn);
    }

    public hasType(name: string): boolean {
        return this.types.has(name);
    }

    private createEntry(
        type: string,
        content: any,
        dependencies: dependencyDefinitionArr
    ): IEntry {
        if (!this.hasType(type)) {
            throw new Error(`Missing type '${type}'.`);
        }
        const typeBootstrapper = this.types.get(type)!;

        const entry: IEntry = {
            isBootstrapped: false,
            content,
            bootstrap: (accessStack: Set<string>) => {
                const constructedDependencies = dependencies.map(
                    dependencyName => this.resolveEntry(dependencyName, accessStack)
                );

                entry.content = typeBootstrapper(
                    entry.content,
                    constructedDependencies
                );
                entry.isBootstrapped = true;
            }
        };

        return entry;
    }

    private resolveEntry(name: string, accessStack: Set<string>) {
        if (accessStack.has(name)) {
            throw new Error(`Circular dependencies were found: '${[...accessStack, name].join("->")}'.`);
        }
        if (!this.has(name)) {
            throw new Error(`Injectable '${name}' does not exist.`);
        }
        const entry = this.injectables.get(name)!;

        if (!entry.isBootstrapped) {
            accessStack.add(name);
            entry.bootstrap(accessStack);
            accessStack.delete(name);
        }

        return entry.content;
    }
}

export { Chevron };
