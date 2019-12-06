import { Bootstrapping } from "../bootstrap/Bootstrapping";
import { Scope } from "../scope/Scope";
import { Nameable } from "../Nameable";

/**
 * Options for injectable registration. See {@link Chevron#registerInjectable} for details.
 *
 * @public
 */
interface InjectableOptions<TValue, UInitializer, VContext> {
    name?: Nameable;
    bootstrapping?: Bootstrapping<any, UInitializer, any, VContext>;
    scope?: Scope<any, UInitializer, any, VContext>;
    dependencies?: Nameable[];
}

export { InjectableOptions };
