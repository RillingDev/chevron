import { bootstrapper } from "./bootstrap/bootstrapper";
import { scoper } from "./scope/scoper";
declare class Chevron<TValue = any, UInitializer = any, VContext = any> {
    private readonly injectables;
    constructor();
    registerInjectable(initializer: UInitializer, bootstrapFn?: bootstrapper<any, UInitializer, any>, dependencies?: string[], name?: string | null, scopeFn?: scoper<any, UInitializer, any, VContext>): void;
    hasInjectable(name: UInitializer | string): boolean;
    hasInjectableInstance(name: UInitializer | string, context?: VContext | null): boolean;
    getInjectableInstance(name: UInitializer | string, context?: VContext | null): TValue;
    private resolveInjectableInstance;
    private getBootstrappedInjectableInstance;
}
export { Chevron };
//# sourceMappingURL=Chevron.d.ts.map