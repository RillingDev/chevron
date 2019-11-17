import { bootstrapper } from "./bootstrap/bootstrapper";
import { scoper } from "./scope/scoper";
declare class Chevron<TValue = any, UInitializer = any> {
    private readonly injectables;
    constructor();
    registerInjectable(initializer: UInitializer, bootstrapFn?: bootstrapper<any, UInitializer, any>, dependencies?: string[], name?: string | null, scopeFn?: scoper<any, UInitializer, any>): void;
    getInjectableInstance(name: UInitializer | string, context?: any): TValue;
    hasInjectable(name: UInitializer | string): boolean;
    hasInjectableInstance(name: UInitializer | string, context?: any): boolean;
    private resolveInjectableInstance;
    private getBootstrappedInjectableInstance;
}
export { Chevron };
//# sourceMappingURL=Chevron.d.ts.map