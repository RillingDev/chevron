import { bootstrapperFunction } from "./injectableTypes/bootstrapperFunction";
import { factoryBootstrapper } from "./injectableTypes/factory";
import { InjectableType } from "./injectableTypes/InjectableType";
import { plainBootstrapper } from "./injectableTypes/plain";
import { serviceBootstrapper } from "./injectableTypes/service";
import { dependencyDefinitionArr } from "./dependencyDefinitionArr";
import { IEntry } from "./IEntry";

class Chevron {
    private readonly types: Map<string, bootstrapperFunction>;
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
        return this.resolveEntry(name);
    }

    public setType(name: string, bootstrapperFn: bootstrapperFunction): void {
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
        const bootstrapperFn = this.types.get(type)!;

        const entry: IEntry = {
            isBootstrapped: false,
            content,
            bootstrap: () => {
                const constructedDependencies = dependencies.map(
                    dependencyName => this.get(dependencyName)
                );

                entry.content = bootstrapperFn(
                    entry.content,
                    constructedDependencies
                );
                entry.isBootstrapped = true;
            }
        };

        return entry;
    }

    private resolveEntry(name: string) {
        if (!this.has(name)) {
            throw new Error(`Injectable '${name}' does not exist.`);
        }
        const entry = this.injectables.get(name)!;

        if (!entry.isBootstrapped) {
            entry.bootstrap();
        }

        return entry.content;
    }
}

export { Chevron };
