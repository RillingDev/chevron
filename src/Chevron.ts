import { DependencyKeyArr } from "./DependencyKeyArr";
import { Entry } from "./Entry";
import { factoryBootstrapper } from "./injectableTypes/factory";
import { InjectableType } from "./injectableTypes/InjectableType";
import { plainBootstrapper } from "./injectableTypes/plain";
import { serviceBootstrapper } from "./injectableTypes/service";
import { TypeBootstrapperFn } from "./injectableTypes/TypeBootstrapperFn";
import { isNil } from "lodash";

class Chevron<TKey = any, UValue = any, VInit = any> {
    private readonly types: Map<string, TypeBootstrapperFn>;
    private readonly injectables: Map<TKey | VInit, Entry<TKey, UValue, VInit>>;

    /**
     * Main chevron class.
     *
     * @public
     * @class Chevron
     */
    public constructor() {
        this.types = new Map();
        this.setType(InjectableType.PLAIN, plainBootstrapper);
        this.setType(InjectableType.SERVICE, serviceBootstrapper);
        this.setType(InjectableType.FACTORY, factoryBootstrapper);

        this.injectables = new Map();
    }

    /**
     * Gets a bootstrapped injectable from the chevron instance.
     *
     * @public
     * @param {*} key Key of the injectable to get.
     * @returns {*} Bootstrapped content of the injectable.
     * @throws Error when the key cannot be found, or circular dependencies exist.
     */
    public get(key: TKey): UValue {
        return this.resolveEntry(key, new Set());
    }

    /**
     * Checks if the chevron instance has a given injectable.
     *
     * @public
     * @param {*} key Key of the injectable to check.
     * @returns {boolean} If the chevron instance has a given injectable.
     */
    public has(key: TKey | VInit): boolean {
        return this.injectables.has(key);
    }

    /**
     * Sets a new injectable on the chevron instance.
     *
     * @public
     * @param {string} type Type of the injectable.
     * @param {string[]} dependencies Array of dependency keys.
     * @param {*} initializer Content of the injectable.
     * @param {*?} key Custom key of the injectable. If none is given, the initializer will be used.
     * @throws Error when the key already exists, or the type is invalid.
     */
    public set(
        type: string,
        dependencies: DependencyKeyArr<TKey>,
        initializer: VInit,
        key?: TKey
    ): void {
        if (!this.hasType(type)) {
            throw new Error(`Missing type '${type}'.`);
        }

        /*
         * Infer the key from the initializer only if no key was explicitly given.
         */
        const effectiveKey = isNil(key) ? initializer : key;

        if (this.has(effectiveKey)) {
            throw new Error(`Key already exists: '${effectiveKey}'.`);
        }

        this.injectables.set(effectiveKey, {
            typeBootstrapper: this.types.get(type)!,
            dependencies,
            initializer,
            content: null
        });
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
    public setType(name: string, bootstrapperFn: TypeBootstrapperFn): void {
        this.types.set(name, bootstrapperFn);
    }

    /**
     * Resolves an entry by its key, keeping track of the access stack.
     *
     * @private
     */
    private resolveEntry(key: TKey, accessStack: Set<TKey>): UValue {
        if (!this.has(key)) {
            throw new Error(`Injectable '${key}' does not exist.`);
        }

        const entry = this.injectables.get(key)!;
        if (isNil(entry.content)) {
            /*
             * Entry is not constructed, recursively bootstrap dependencies and the entry itself.
             */
            this.bootstrap(key, accessStack, entry);
        }

        return entry.content!;
    }

    /**
     * Bootstraps an entry, keeping track of the access stack.
     *
     * @private
     */
    private bootstrap(
        key: TKey,
        accessStack: Set<TKey>,
        entry: Entry<TKey, UValue, VInit>
    ): void {
        /*
         * Check if we already tried accessing this injectable before; if we did, assume circular dependencies.
         */
        if (accessStack.has(key)) {
            throw new Error(
                `Circular dependencies found: '${[...accessStack, key].join(
                    "->"
                )}'.`
            );
        }

        accessStack.add(key);
        entry.content = entry.typeBootstrapper(
            entry.initializer,
            entry.dependencies.map(dependencyName =>
                this.resolveEntry(dependencyName, accessStack)
            )
        );
        accessStack.delete(key);
    }
}

export { Chevron };
