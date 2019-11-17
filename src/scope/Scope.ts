import { InjectableEntry } from "../InjectableEntry";

type Scope<TValue, UInitializer, VDependency, WContext> = (
    name: string,
    injectableEntry: InjectableEntry<
        TValue,
        UInitializer,
        VDependency,
        WContext
    >,
    context: WContext | null
) => string | null;

export { Scope };
