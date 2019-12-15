import { Bootstrapping } from "../bootstrap/Bootstrapping";
import { Scope } from "../scope/Scope";

/**
 * Interface of every nameable value.
 *
 * @private
 */
interface NameableObject {
    name: string;
}

/**
 * Union type of every nameable value that {@link getName} can use.
 *
 * @private
 */
type Nameable = NameableObject | string | symbol;

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
