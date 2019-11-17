import { InjectableOptions } from "./injectable/InjectableOptions";
/**
 * Injectable container class.
 *
 * @class
 */
declare class Chevron<TValue = any, UInitializer = any, VContext = any> {
    private readonly injectables;
    constructor();
    /**
     * Registers a new injectable on this container.
     *
     * @param initializer Initial value of this injectable. This can be any value, but usually  a class or a different kind of function.
     *      During retrieval, the initial value might be transformed by the bootstrapper (see {@link Bootstrapping} for details).
     *      If no name is provided in the options (see description of the options parameter, section "name"),
     *      a name will be determined from the initializer through {@link getName}.
     * @param dependencies Definitions of this injectables dependencies. Values can be either plain strings ("MyOtherService"),
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
    registerInjectable(initializer: UInitializer, dependencies: any[], options?: InjectableOptions<TValue, UInitializer, VContext>): void;
    /**
     * Checks if an injectable with the name provided is registered for this container, regardless if its instantiated or not.
     * To check if an injectable is registered and instantiated, see {@link #hasInjectableInstance}.
     *
     * @param name Either a raw string name or a nameable value that should be checked for. See {@link #registerInjectable} for details.
     * @return if an injectable with the name provided is registered on this container.
     * @throws TypeError when no name can be determined for the provided nameable.
     */
    hasInjectable(name: UInitializer | string): boolean;
    /**
     * Checks if an injectable with the name provided is registered and instantiated for this container.
     * To check if an injectable is registered without checking for instantiation, see {@link #hasInjectable}.
     *
     * @param name Either a raw string name or a nameable value that should be checked for. See {@link #registerInjectable} for details.
     * @param context Context to be used for instance checks. See {@link Scope} for details.
     * @return if an injectable with the name provided is registered and instantiated on this container.
     * @throws TypeError when no name can be determined for the provided nameable.
     */
    hasInjectableInstance(name: UInitializer | string, context?: VContext | null): boolean;
    /**
     * Retrieves an instantiated injectable, recursively instantiating dependencies if they were not instantiated before.
     *
     * @param name Either a raw string name or a nameable value that should be retrieved. See {@link #registerInjectable} for details.
     * @param context Context to be used for instance checks. See {@link Scope} for details.
     * @return instantiated injectable for the given name.
     * @throws TypeError when no name can be determined for the provided nameable.
     * @throws Error when a dependency cannot be found.
     * @throws Error when recursive dependencies are detected.
     */
    getInjectableInstance(name: UInitializer | string, context?: VContext | null): TValue;
    private resolveInjectableInstance;
    private getBootstrappedInjectableInstance;
}
export { Chevron };
//# sourceMappingURL=Chevron.d.ts.map