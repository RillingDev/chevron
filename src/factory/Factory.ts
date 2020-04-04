/**
 * Function interface for a factory function.
 * Instantiation takes place when creating an injectable instance from its initializer,
 * e.g. by constructing a class ({@link DefaultFactory.CLASS}) or executing a factory function ({@link DefaultFactory.FUNCTION}).
 *
 * The factory function has access to the initializer and its initialized dependencies (in the order they were defined in),
 * as well as the name and injectable that is to be instantiated, and should return an instantiated value for them.
 *
 * @public
 */
type Factory<TInstance, UInitializer, VDependency, WContext> = (
    initializer: UInitializer,
    dependencies: VDependency[],
    context: WContext,
    injectableEntryName: string
) => TInstance;

export { Factory };
