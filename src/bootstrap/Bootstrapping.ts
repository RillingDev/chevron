import { InjectableEntry } from "../injectable/InjectableEntry";

type Bootstrapping<TValue, UInitializer, VDependency, WContext> = (
    initializer: UInitializer,
    dependencies: VDependency[],
    name: string,
    injectableEntry: InjectableEntry<
        TValue,
        UInitializer,
        VDependency,
        WContext
    >
) => TValue;

export { Bootstrapping };
