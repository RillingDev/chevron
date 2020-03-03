import { Factory } from "../factory/Factory";
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
    factory?: Factory<TInstance, UInitializer, VDependency, WContext>;
    scope?: Scope<WContext>;
}
export { InjectableOptions };
//# sourceMappingURL=InjectableOptions.d.ts.map