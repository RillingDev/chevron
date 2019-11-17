import { Bootstrapping } from "./bootstrap/Bootstrapping";
import { Scope } from "./scope/Scope";

interface InjectableEntry<TValue, UInitializer, VDependency, WContext> {
    bootstrap: Bootstrapping<TValue, UInitializer, VDependency>;
    scopeFn: Scope<TValue, UInitializer, VDependency, WContext>;
    dependencies: string[];
    initializer: UInitializer;
    instances: Map<string, TValue>;
}

export { InjectableEntry };
