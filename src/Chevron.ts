import { isNil, isString } from "lodash";
import { name as getName } from "lightdash";
import { bootstrapper } from "./bootstrap/bootstrapper";
import { Bootstrappers } from "./bootstrap/Bootstrappers";
import { Entry } from "./Entry";
import { scoper } from "./scope/scoper";
import { Scopes } from "./scope/Scopes";

class Chevron<TValue = any, UInitializer = any> {
    private readonly injectables: Map<
        string,
        Entry<TValue, UInitializer, TValue>
    >;

    public constructor() {
        this.injectables = new Map();
    }

    public get(name: UInitializer | string, context: any = null): TValue {
        return this.resolveEntry(name, context, new Set());
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
        > = Bootstrappers.IDENTITY,
        dependencies: string[] = [],
        name: string | null = null,
        scopeFn: scoper<any, UInitializer, any> = Scopes.SINGLETON
    ): void {
        const key = !isNil(name) ? name : this.getKey(initializer);

        if (this.injectables.has(key)) {
            throw new Error(`Key already exists: '${key}'.`);
        }

        this.injectables.set(key, {
            bootstrapFn,
            scopeFn,
            dependencies,
            initializer,
            instances: new Map()
        });
    }

    private resolveEntry(
        name: string | UInitializer,
        context: any,
        resolveStack: Set<string>
    ): TValue {
        const entryName = isString(name) ? name : this.getKey(name);
        if (!this.injectables.has(entryName)) {
            throw new Error(`Injectable '${name}' does not exist.`);
        }

        const entry = this.injectables.get(entryName)!;
        const instanceName = entry.scopeFn(entryName, entry, context);
        if (!entry.instances.has(instanceName)) {
            /*
             * Start bootstrapping value.
             */
            if (resolveStack.has(entryName)) {
                throw new Error(
                    `Circular dependencies found: '${[
                        ...resolveStack,
                        entryName
                    ].join("->")}'.`
                );
            }
            resolveStack.add(entryName);

            const instance = entry.bootstrapFn(
                entry.initializer,
                entry.dependencies.map(dependencyName =>
                    this.resolveEntry(dependencyName, context, resolveStack)
                )
            );
            entry.instances.set(instanceName, instance);

            resolveStack.delete(entryName);
        }
        return entry.instances.get(instanceName)!;
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
