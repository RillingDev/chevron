import { isNil, isString } from "lodash";
import { name as getName } from "lightdash";
import { Bootstrapping } from "./bootstrap/Bootstrapping";
import { DefaultBootstrappings } from "./bootstrap/DefaultBootstrappings";
import { InjectableEntry } from "./InjectableEntry";
import { Scope } from "./scope/Scope";
import { DefaultScopes } from "./scope/DefaultScopes";

const guessName = (initializer: any): string => {
    const guessedName = getName(initializer);
    if (isNil(guessedName)) {
        throw new TypeError(
            `Could not guess name of ${initializer}, please explicitly define one.`
        );
    }
    return guessedName;
};

const getInjectableName = (name: any): string =>
    isString(name) ? name : guessName(name);

const createCircularDependencyError = (
    entryName: string,
    resolveStack: Set<string>
): Error => {
    return new Error(
        `Circular dependencies found: '${[...resolveStack, entryName].join(
            "->"
        )}'.`
    );
};

interface ResolvedInstance<TValue, UInitializer, VContext> {
    entryName: string;
    injectableEntry: InjectableEntry<TValue, UInitializer, TValue, VContext>;
    instanceName: string | null;
}

/**
 * Injectable container class.
 *
 * @class
 */
class Chevron<TValue = any, UInitializer = any, VContext = any> {
    private readonly injectables: Map<
        string,
        InjectableEntry<TValue, UInitializer, TValue, VContext>
    >;

    public constructor() {
        this.injectables = new Map();
    }

    public registerInjectable(
        initializer: UInitializer,
        bootstrapping: Bootstrapping<
            any,
            UInitializer,
            any
        > = DefaultBootstrappings.IDENTITY,
        dependencies: string[] = [],
        name: string | null = null,
        scope: Scope<any, UInitializer, any, VContext> = DefaultScopes.SINGLETON
    ): void {
        const injectableEntryName = isString(name)
            ? name
            : guessName(initializer);

        if (this.injectables.has(injectableEntryName)) {
            throw new Error(`Name already exists: '${injectableEntryName}'.`);
        }

        this.injectables.set(injectableEntryName, {
            bootstrap: bootstrapping,
            scopeFn: scope,
            dependencies,
            initializer,
            instances: new Map()
        });
    }

    public hasInjectable(name: UInitializer | string): boolean {
        return this.injectables.has(getInjectableName(name));
    }

    public hasInjectableInstance(
        name: UInitializer | string,
        context: VContext | null = null
    ): boolean {
        const {
            injectableEntry,
            instanceName
        } = this.resolveInjectableInstance(name, context);

        return (
            instanceName != null && injectableEntry.instances.has(instanceName)
        );
    }

    public getInjectableInstance(
        name: UInitializer | string,
        context: VContext | null = null
    ): TValue {
        return this.getBootstrappedInjectableInstance(name, context, new Set());
    }

    private resolveInjectableInstance(
        name: string | UInitializer,
        context: VContext | null
    ): ResolvedInstance<TValue, UInitializer, VContext> {
        const injectableEntryName = getInjectableName(name);

        if (!this.injectables.has(injectableEntryName)) {
            throw new Error(`Injectable '${name}' does not exist.`);
        }

        const injectableEntry = this.injectables.get(injectableEntryName)!;
        const instanceName = injectableEntry.scopeFn(
            injectableEntryName,
            injectableEntry,
            context
        );
        return {
            entryName: injectableEntryName,
            injectableEntry,
            instanceName
        };
    }

    private getBootstrappedInjectableInstance(
        name: string | UInitializer,
        context: any,
        resolveStack: Set<string>
    ): TValue {
        const {
            entryName,
            injectableEntry,
            instanceName
        } = this.resolveInjectableInstance(name, context);

        if (
            instanceName != null &&
            injectableEntry.instances.has(instanceName)
        ) {
            return injectableEntry.instances.get(instanceName)!;
        }

        /*
         * Start bootstrapping value.
         */
        if (resolveStack.has(entryName)) {
            throw createCircularDependencyError(entryName, resolveStack);
        }
        resolveStack.add(entryName);

        const instance = injectableEntry.bootstrap(
            injectableEntry.initializer,
            injectableEntry.dependencies.map(dependencyName =>
                this.getBootstrappedInjectableInstance(
                    dependencyName,
                    context,
                    resolveStack
                )
            )
        );
        if (instanceName != null) {
            injectableEntry.instances.set(instanceName, instance);
        }

        resolveStack.delete(entryName);

        return instance;
    }
}

export { Chevron };
