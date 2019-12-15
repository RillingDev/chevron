import { Bootstrapping } from "../bootstrap/Bootstrapping";
import { Scope } from "../scope/Scope";
/**
 * Internal representation of a registered injectable.
 *
 * @private
 */
interface InjectableEntry<TValue, UInitializer, VDependency, WContext> {
    initializer: UInitializer;
    dependencyNames: string[];
    instances: Map<string, TValue>;
    bootstrapping: Bootstrapping<TValue, UInitializer, VDependency, WContext>;
    scope: Scope<TValue, UInitializer, VDependency, WContext>;
}
export { InjectableEntry };
//# sourceMappingURL=InjectableEntry.d.ts.map