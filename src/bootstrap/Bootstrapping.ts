/**
 * Function interface for a bootstrapping function.
 * Bootstrapping takes place when creating an injectable instance from its initializer,
 * e.g. by constructing a class ({@link DefaultBootstrappings.CLASS}) or executing a factory function ({@link DefaultBootstrappings.FUNCTION}).
 *
 * The bootstrapping function has access to the initializer and its initialized dependencies (in the order they were defined in),
 * as well as the name and injectable that is to be bootstrapped, and should return an instantiated value for them.
 *
 * @public
 */
type Bootstrapping<TInstance, UInitializer, VDependency, WContext> = (
    initializer: UInitializer,
    dependencies: VDependency[],
    context: WContext,
    injectableEntryName: string
) => TInstance;

export { Bootstrapping };
