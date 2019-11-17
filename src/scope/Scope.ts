import { InjectableEntry } from "../injectable/InjectableEntry";

type Scope<TValue, UInitializer, VDependency, WContext> = (
    context: WContext | null,
    injectableEntryName: string,
    injectableEntry: InjectableEntry<
        TValue,
        UInitializer,
        VDependency,
        WContext
    >
) => string | null;

export { Scope };
