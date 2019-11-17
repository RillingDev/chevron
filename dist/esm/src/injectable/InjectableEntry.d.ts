import { Bootstrapping } from "../bootstrap/Bootstrapping";
import { Scope } from "../scope/Scope";
interface InjectableEntry<TValue, UInitializer, VDependency, WContext> {
    bootstrapping: Bootstrapping<TValue, UInitializer, VDependency>;
    scope: Scope<TValue, UInitializer, VDependency, WContext>;
    dependencies: string[];
    initializer: UInitializer;
    instances: Map<string, TValue>;
}
export { InjectableEntry };
//# sourceMappingURL=InjectableEntry.d.ts.map