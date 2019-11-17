import { Bootstrapping } from "../bootstrap/Bootstrapping";
import { Scope } from "../scope/Scope";
interface InjectableOptions<TValue, UInitializer, VContext> {
    name?: string;
    bootstrapping?: Bootstrapping<any, UInitializer, any, VContext>;
    scope?: Scope<any, UInitializer, any, VContext>;
}
export { InjectableOptions };
//# sourceMappingURL=InjectableOptions.d.ts.map