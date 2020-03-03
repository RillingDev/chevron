import { Factory } from "../factory/Factory";
import { Scope } from "../scope/Scope";
/**
 * Internal representation of a registered injectable.
 *
 * @private
 */
interface InjectableEntry<TInstance, UInitializer, VDependency, WContext> {
    initializer: UInitializer;
    dependencyNames: string[];
    factory: Factory<TInstance, UInitializer, VDependency, WContext>;
    scope: Scope<WContext>;
    instances: Map<string, TInstance>;
}
export { InjectableEntry };
//# sourceMappingURL=InjectableEntry.d.ts.map