import { isNil } from "lodash";
import { name as getName } from "lightdash";
import { InjectableEntry } from "./injectable/InjectableEntry";
import { InjectableOptions } from "./injectable/InjectableOptions";
import { DefaultBootstrappings } from "./bootstrap/DefaultBootstrappings";
import { DefaultScopes } from "./scope/DefaultScopes";

/**
 * Tries to guess the string name of a nameable value. if none can be determined, an error is thrown.
 * See {@link Nameable} and {@link getName} for details.
 *
 * @private
 * @param value Value to to guess a name for.
 * @return Name of the value.
 * @throws TypeError when to name can be guessed.
 */
const guessName = (value: any): string => {
    const guessedName = getName(value);
    if (isNil(guessedName)) {
        throw new TypeError(
            `Could not guess name of '${String(
                value
            )}', please explicitly define one.`
        );
    }
    return guessedName;
};

/**
 * Creates an error circular injectable dependencies.
 *
 * @private
 * @param resolveStack Resolve stack.
 * @param injectableEntryName Current injectable name that caused the error.
 * @return Created error
 */
const createCircularDependencyError = (
    resolveStack: Set<string>,
    injectableEntryName: string
): Error => {
    const resolveStackFull = [...Array.from(resolveStack), injectableEntryName];
    const stackVisualization = resolveStackFull
        .map(name => `'${name}'`)
        .join(" -> ");
    return new Error(`Circular dependencies found: ${stackVisualization}.`);
};

/**
 * Helper interface for {@link Chevron#resolveInjectableInstance} lookups.
 *
 * @private
 */
interface ResolvedInstance<TInstance, UInitializer, VContext> {
    injectableEntry: InjectableEntry<
        TInstance,
        UInitializer,
        TInstance,
        VContext
    >;
    instanceName: string | null;
}

/**
 * Injectable container class.
 *
 * @public
 * @class
 */
class Chevron<TInstance = any, UInitializer = any, VContext = any> {
    private readonly injectables: Map<
        string,
        InjectableEntry<TInstance, UInitializer, TInstance, VContext | null>
    >;

    /**
     * Creates a new, empty container.
     *
     * @public
     */
    public constructor() {
        this.injectables = new Map();
    }

    /**
     * Registers a new injectable on this container.
     *
     * @public
     * @param initializer Initial value of this injectable. This can be any value, but usually  a class or a different kind of function.
     *      During retrieval, the initial value might be transformed by the bootstrapper (see {@link Bootstrapping} for details).
     *      If no name is provided in the options (see description of the options parameter, section "name"),
     *      a name will be determined from the initializer through {@link getName}.
     *      or a value which is nameable. For details on nameable values see {@link getName}.
     * @param options Options for this injectable. The following options exist:
     *      <ul>
     *          <li>name:
     *                  Name for this injectable. If this is not provided, the name will be determined based on the initializer.
     *                  (see description of the initializer parameter)
     *          </li>
     *          <li>bootstrapping:
     *                  Bootstrapping strategy to use when instantiating this injectable (see {@link Bootstrapping} for details).
     *                  By default, {@link DefaultBootstrappings.IDENTITY} is used. If your injectable is a class or factory function,
     *                  consider using {@link DefaultBootstrappings.CLASS} or {@link DefaultBootstrappings.FUNCTION} instead respectively,
     *                  or provide your own.
     *          </li>
     *          <li>scope:
     *                  Scoping strategy to use when retrieving instances (see {@link Scope} for details).
     *                  By default, {@link DefaultScopes.SINGLETON} is used. For different use cases,
     *                  see {@link DefaultScopes.PROTOTYPE} or provide your own.
     *          </li>
     *      </ul>
     * @throws Error when an injectable with the requested name is already registered.
     * @throws TypeError when no name can be determined for this injectable or any of its dependencies.
     */
    public registerInjectable(
        initializer: UInitializer,
        options: InjectableOptions<
            TInstance,
            UInitializer,
            VContext | null
        > = {}
    ): void {
        const bootstrapping =
            options.bootstrapping ?? DefaultBootstrappings.IDENTITY;
        const scope = options.scope ?? DefaultScopes.SINGLETON;
        const name = options.name ?? null;
        const dependencies = options.dependencies ?? [];

        const injectableEntryName = !isNil(name)
            ? guessName(name)
            : guessName(initializer);

        if (this.injectables.has(injectableEntryName)) {
            throw new Error(`Name already exists: '${injectableEntryName}'.`);
        }

        this.injectables.set(injectableEntryName, {
            initializer,
            bootstrapping,
            scope,
            dependencyNames: dependencies.map(dependencyName =>
                guessName(dependencyName)
            ),
            instances: new Map()
        });
    }

    /**
     * Checks if an injectable with the name provided is registered for this container, regardless if its instantiated or not.
     * To check if an injectable is registered and instantiated, see {@link #hasInjectableInstance}.
     *
     * @public
     * @param name Either a raw string name or a nameable value that should be checked for. See {@link #registerInjectable} for details.
     * @return if an injectable with the name provided is registered on this container.
     * @throws TypeError when no name can be determined for the provided nameable.
     */
    public hasInjectable(name: UInitializer | string): boolean {
        return this.injectables.has(guessName(name));
    }

    /**
     * Checks if an injectable with the name provided is registered and instantiated for this container.
     * To check if an injectable is registered without checking for instantiation, see {@link #hasInjectable}.
     *
     * @public
     * @param name Either a raw string name or a nameable value that should be checked for. See {@link #registerInjectable} for details.
     * @param context Context to be used for instance checks. See {@link Scope} for details.
     * @return if an injectable with the name provided is registered and instantiated on this container.
     * @throws TypeError when no name can be determined for the provided nameable.
     */
    public hasInjectableInstance(
        name: UInitializer | string,
        context: VContext | null = null
    ): boolean {
        if (!this.hasInjectable(name)) {
            return false;
        }

        const {
            injectableEntry,
            instanceName
        } = this.resolveInjectableInstance(guessName(name), context);

        return (
            instanceName != null && injectableEntry.instances.has(instanceName)
        );
    }

    /**
     * Retrieves an instantiated injectable, recursively instantiating dependencies if they were not instantiated before.
     *
     * @public
     * @param name Either a raw string name or a nameable value that should be retrieved. See {@link #registerInjectable} for details.
     * @param context Context to be used for instance checks. See {@link Scope} for details.
     * @return instantiated injectable for the given name.
     * @throws TypeError when no name can be determined for the provided nameable.
     * @throws Error when the injectable or a dependency cannot be found.
     * @throws Error when recursive dependencies are detected.
     */
    public getInjectableInstance(
        name: UInitializer | string,
        context: VContext | null = null
    ): TInstance {
        return this.getBootstrappedInjectableInstance(
            guessName(name),
            context,
            new Set()
        );
    }

    /**
     * Resolves an injectable by name, providing information about the injectable entry, its name and scope value.
     *
     * @private
     * @param injectableEntryName Raw string name of the injectable.
     * @param context Context to be used for instance checks. See {@link Scope} for details.
     * @return data object containing the injectable entry, its name and scope value.
     * @throws Error if no injectable for the name is found.
     */
    private resolveInjectableInstance(
        injectableEntryName: string,
        context: VContext | null
    ): ResolvedInstance<TInstance, UInitializer, VContext | null> {
        if (!this.injectables.has(injectableEntryName)) {
            throw new Error(
                `Injectable '${injectableEntryName}' does not exist.`
            );
        }

        const injectableEntry = this.injectables.get(injectableEntryName)!;
        const instanceName = injectableEntry.scope(
            context,
            injectableEntryName
        );
        return {
            injectableEntry,
            instanceName
        };
    }

    /**
     * Retrieves an instantiated injectable, recursively instantiating dependencies if they were not instantiated before.
     *
     * @private
     * @param injectableEntryName Raw string name of the injectable.
     * @param context Context to be used for instance checks. See {@link Scope} for details.
     * @param resolveStack Stack of previously requested instantiations. used to detect circular dependencies.
     * @return instantiated injectable for the given name.
     * @throws Error if no injectable for the name is found.
     * @throws Error when a dependency cannot be found.
     * @throws Error when recursive dependencies are detected.
     */
    private getBootstrappedInjectableInstance(
        injectableEntryName: string,
        context: VContext | null,
        resolveStack: Set<string>
    ): TInstance {
        const {
            injectableEntry,
            instanceName
        } = this.resolveInjectableInstance(injectableEntryName, context);

        if (
            instanceName != null &&
            injectableEntry.instances.has(instanceName)
        ) {
            return injectableEntry.instances.get(instanceName)!;
        }

        /*
         * Start bootstrapping value.
         */
        if (resolveStack.has(injectableEntryName)) {
            throw createCircularDependencyError(
                resolveStack,
                injectableEntryName
            );
        }
        resolveStack.add(injectableEntryName);

        const bootstrappedDependencies = injectableEntry.dependencyNames.map(
            dependencyName =>
                this.getBootstrappedInjectableInstance(
                    dependencyName,
                    null, // Do not delegate context
                    resolveStack
                )
        );
        const instance = injectableEntry.bootstrapping(
            injectableEntry.initializer,
            bootstrappedDependencies,
            context,
            injectableEntryName
        );
        if (instanceName != null) {
            injectableEntry.instances.set(instanceName, instance);
        }

        resolveStack.delete(injectableEntryName);

        return instance;
    }
}

export { Chevron };
