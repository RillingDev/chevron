import { isNil, isString } from "lodash";
import { name as getName } from "lightdash";
import { bootstrapper } from "./bootstrap/bootstrapper";
import { Bootstrappers } from "./bootstrap/Bootstrappers";
import { Entry } from "./Entry";
import { scoper } from "./scope/scoper";
import { Scopes } from "./scope/Scopes";

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
    entry: Entry<TValue, UInitializer, TValue, VContext>;
    instanceName: string | null;
}

class Chevron<TValue = any, UInitializer = any, VContext = any> {
    private readonly injectables: Map<
        string,
        Entry<TValue, UInitializer, TValue, VContext>
    >;

    public constructor() {
        this.injectables = new Map();
    }

    public registerInjectable(
        initializer: UInitializer,
        bootstrapFn: bootstrapper<
            any,
            UInitializer,
            any
        > = Bootstrappers.IDENTITY,
        dependencies: string[] = [],
        name: string | null = null,
        scopeFn: scoper<any, UInitializer, any, VContext> = Scopes.SINGLETON
    ): void {
        const entryName = isString(name) ? name : guessName(initializer);

        if (this.injectables.has(entryName)) {
            throw new Error(`Name already exists: '${entryName}'.`);
        }

        this.injectables.set(entryName, {
            bootstrapFn,
            scopeFn,
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
        const { entry, instanceName } = this.resolveInjectableInstance(
            name,
            context
        );

        return instanceName != null && entry.instances.has(instanceName);
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
        const entryName = getInjectableName(name);

        if (!this.injectables.has(entryName)) {
            throw new Error(`Injectable '${name}' does not exist.`);
        }

        const entry = this.injectables.get(entryName)!;
        const instanceName = entry.scopeFn(entryName, entry, context);
        return { entryName, entry, instanceName };
    }

    private getBootstrappedInjectableInstance(
        name: string | UInitializer,
        context: any,
        resolveStack: Set<string>
    ): TValue {
        const {
            entryName,
            entry,
            instanceName
        } = this.resolveInjectableInstance(name, context);

        if (instanceName != null && entry.instances.has(instanceName)) {
            return entry.instances.get(instanceName)!;
        }

        /*
         * Start bootstrapping value.
         */
        if (resolveStack.has(entryName)) {
            throw createCircularDependencyError(entryName, resolveStack);
        }
        resolveStack.add(entryName);

        const instance = entry.bootstrapFn(
            entry.initializer,
            entry.dependencies.map(dependencyName =>
                this.getBootstrappedInjectableInstance(
                    dependencyName,
                    context,
                    resolveStack
                )
            )
        );
        if (instanceName != null) {
            entry.instances.set(instanceName, instance);
        }

        resolveStack.delete(entryName);

        return instance;
    }
}

export { Chevron };
