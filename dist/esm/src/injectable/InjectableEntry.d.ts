import { Bootstrapping } from "../bootstrap/Bootstrapping";
import { Scope } from "../scope/Scope";
/**
 * Internal representation of a registered injectable.
 *
 * @private
 */
interface InjectableEntry<TInstance, UInitializer, WContext> {
    initializer: UInitializer;
    dependencyNames: string[];
    bootstrapping: Bootstrapping<TInstance, UInitializer, TInstance, WContext>;
    scope: Scope<WContext>;
    instances: Map<string, TInstance>;
}
export { InjectableEntry };
//# sourceMappingURL=InjectableEntry.d.ts.map