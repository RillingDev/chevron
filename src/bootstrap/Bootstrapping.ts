import { InjectableEntry } from "../injectable/InjectableEntry";

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
type Bootstrapping<TValue, UInitializer, VDependency, WContext> = (
    initializer: UInitializer,
    dependencies: VDependency[],
    context: WContext | null,
    injectableEntryName: string,
    injectableEntry: InjectableEntry<
        TValue,
        UInitializer,
        VDependency,
        WContext
    >
) => TValue;

export { Bootstrapping };
