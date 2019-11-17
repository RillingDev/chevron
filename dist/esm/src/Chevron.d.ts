import { Bootstrapping } from "./bootstrap/Bootstrapping";
import { Scope } from "./scope/Scope";
/**
 * Injectable container class.
 *
 * @class
 */
declare class Chevron<TValue = any, UInitializer = any, VContext = any> {
    private readonly injectables;
    constructor();
    registerInjectable(initializer: UInitializer, bootstrapping?: Bootstrapping<any, UInitializer, any>, dependencies?: string[], name?: string | null, scope?: Scope<any, UInitializer, any, VContext>): void;
    hasInjectable(name: UInitializer | string): boolean;
    hasInjectableInstance(name: UInitializer | string, context?: VContext | null): boolean;
    getInjectableInstance(name: UInitializer | string, context?: VContext | null): TValue;
    private resolveInjectableInstance;
    private getBootstrappedInjectableInstance;
}
export { Chevron };
//# sourceMappingURL=Chevron.d.ts.map