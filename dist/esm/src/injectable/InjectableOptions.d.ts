import { Bootstrapping } from "../bootstrap/Bootstrapping";
import { Scope } from "../scope/Scope";
import { Nameable } from "./Nameable";
/**
 * Options for injectable registration. See {@link Chevron#registerInjectable} for details.
 *
 * @public
 */
interface InjectableOptions<TInstance, UInitializer, VDependency, WContext> {
    name?: Nameable;
    dependencies?: Nameable[];
    bootstrapping?: Bootstrapping<TInstance, UInitializer, VDependency, WContext>;
    scope?: Scope<WContext>;
}
export { InjectableOptions };
//# sourceMappingURL=InjectableOptions.d.ts.map