import { Bootstrapping } from "../bootstrap/Bootstrapping";
import { Scope } from "../scope/Scope";

/**
 * Options for injectable registration. See {@link Chevron#registerInjectable} for details.
 *
 * @public
 */
interface InjectableOptions<TValue, UInitializer, VContext> {
    name?: string;
    bootstrapping?: Bootstrapping<any, UInitializer, any, VContext>;
    scope?: Scope<any, UInitializer, any, VContext>;
    dependencies?: any[];
}

export { InjectableOptions };
