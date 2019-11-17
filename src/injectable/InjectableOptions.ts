import { Bootstrapping } from "../bootstrap/Bootstrapping";
import { Scope } from "../scope/Scope";

interface InjectableOptions<TValue, UInitializer, VContext> {
    bootstrapping?: Bootstrapping<any, UInitializer, any>;
    scope?: Scope<any, UInitializer, any, VContext>;
    name?: string;
}

export { InjectableOptions };
