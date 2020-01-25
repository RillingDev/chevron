import { Bootstrapping } from "../bootstrap/Bootstrapping";
import { Scope } from "../scope/Scope";

/**
 * Internal representation of a registered injectable.
 *
 * @private
 */
interface InjectableEntry<TInstance, UInitializer, VDependency, WContext> {
    initializer: UInitializer;
    dependencyNames: string[];
    instances: Map<string, TInstance>;
    bootstrapping: Bootstrapping<TInstance, UInitializer, VDependency, WContext>;
    scope: Scope<TInstance, UInitializer, VDependency, WContext>;
}

export { InjectableEntry };
