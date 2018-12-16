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
     * Main chevron class.
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
     * Gets a bootstrapped injectable from the chevron instance.
     *
     * @public
     * @param {string} name Name of the injectable to get.
     * @returns {*} Bootstrapped content of the injectable.
     * @throws Error when the name cannot be found, or circular dependencies exist.
     */
    public get(name: string): any {
        return this.resolveEntry(name, new Set());
    }

    /**
     * Checks if the chevron instance has a given injectable.
     *
     * @public
     * @param {string} name Name of the injectable to check.
     * @returns {boolean} If the chevron instance has a given injectable.
     */
    public has(name: string): boolean {
        return this.injectables.has(name);
    }

    /**
     * Set a new injectable on the chevron instance.
     *
     * @public
     * @param {string} name Name of the injectable.
     * @param {string} type Type of the injectable.
     * @param {string[]} dependencies Array of dependency names.
     * @param {*} content Content of the injectable.
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
     * Checks if the chevron instance has a given injectable type.
     *
     * @public
     * @param {string} name Name of the injectable type to check.
     * @returns {boolean} If the chevron instance has a given injectable type.
     */
    public hasType(name: string): boolean {
        return this.types.has(name);
    }

    /**
     * Sets a type of injectables.
     *
     * @public
     * @param {string} name Name of the type.
     * @param {function} bootstrapperFn Bootstrap function for injectables of this type.
     */
    public setType(name: string, bootstrapperFn: typeBootstrapperFn): void {
        this.types.set(name, bootstrapperFn);
    }

    private resolveEntry(name: string, accessStack: Set<string>) {
        if (accessStack.has(name)) {
            throw new Error(
                `Circular dependencies were found: '${[
                    ...accessStack,
                    name
                ].join("->")}'.`
            );
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
                    dependencyName =>
                        this.resolveEntry(dependencyName, accessStack)
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
}

export { Chevron };
