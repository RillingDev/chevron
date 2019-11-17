import { Bootstrapping } from "../bootstrap/Bootstrapping";
import { Scope } from "../scope/Scope";

interface InjectableEntry<TValue, UInitializer, VDependency, WContext> {
    initializer: UInitializer;
    dependencies: string[];
    instances: Map<string, TValue>;
    bootstrapping: Bootstrapping<TValue, UInitializer, VDependency, WContext>;
    scope: Scope<TValue, UInitializer, VDependency, WContext>;
}

export { InjectableEntry };
