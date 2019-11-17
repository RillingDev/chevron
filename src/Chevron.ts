import { isNil, isString } from "lodash";
import { name as getName } from "lightdash";
import { bootstrapper } from "./bootstrap/bootstrapper";
import { DefaultBootstrappers } from "./bootstrap/DefaultBootstrappers";

interface Entry<TValue, UInitializer, VDependency> {
    bootstrapFn: bootstrapper<TValue, UInitializer, VDependency>;
    dependencies: string[];
    initializer: UInitializer;
    value: TValue | null;
}

class Chevron<TValue = any, UInitializer = any> {
    private readonly injectables: Map<
        string,
        Entry<TValue, UInitializer, TValue>
    >;

    public constructor() {
        this.injectables = new Map();
    }

    public get(name: UInitializer | string): TValue {
        return this.resolveEntry(name, new Set());
    }

    public has(name: UInitializer | string): boolean {
        return this.injectables.has(isString(name) ? name : this.getKey(name));
    }

    public register(
        initializer: UInitializer,
        bootstrapFn: bootstrapper<
            any,
            UInitializer,
            any
        > = DefaultBootstrappers.IDENTITY,
        dependencies: string[] = [],
        name: string | null = null
    ): void {
        const key = !isNil(name) ? name : this.getKey(initializer);

        if (this.injectables.has(key)) {
            throw new Error(`Key already exists: '${key}'.`);
        }

        this.injectables.set(key, {
            bootstrapFn: bootstrapFn,
            dependencies,
            initializer,
            value: null
        });
    }

    private resolveEntry(
        name: string | UInitializer,
        resolveStack: Set<string>
    ): TValue {
        const key = isString(name) ? name : this.getKey(name);
        if (!this.injectables.has(key)) {
            throw new Error(`Injectable '${name}' does not exist.`);
        }

        const entry = this.injectables.get(key)!;
        if (isNil(entry.value)) {
            /*
             * Start bootstrapping value.
             */
            if (resolveStack.has(key)) {
                throw new Error(
                    `Circular dependencies found: '${[
                        ...resolveStack,
                        key
                    ].join("->")}'.`
                );
            }
            resolveStack.add(key);

            entry.value = entry.bootstrapFn(
                entry.initializer,
                entry.dependencies.map(dependencyName =>
                    this.resolveEntry(dependencyName, resolveStack)
                )
            );

            resolveStack.delete(key);
        }
        return entry.value;
    }

    private getKey(initializer: UInitializer): string {
        const guessedName = getName(initializer);
        if (isNil(guessedName)) {
            throw new TypeError(
                `Could not guess name of ${initializer}, please explicitly define one.`
            );
        }
        return guessedName;
    }
}

export { Chevron };
