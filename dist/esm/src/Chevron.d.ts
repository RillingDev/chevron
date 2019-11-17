import { InjectableOptions } from "./injectable/InjectableOptions";
/**
 * Injectable container class.
 *
 * @class
 */
declare class Chevron<TValue = any, UInitializer = any, VContext = any> {
    private readonly injectables;
    constructor();
    registerInjectable(initializer: UInitializer, dependencies: any[], options?: InjectableOptions<TValue, UInitializer, VContext>): void;
    hasInjectable(name: UInitializer | string): boolean;
    hasInjectableInstance(name: UInitializer | string, context?: VContext | null): boolean;
    getInjectableInstance(name: UInitializer | string, context?: VContext | null): TValue;
    private resolveInjectableInstance;
    private getBootstrappedInjectableInstance;
}
export { Chevron };
//# sourceMappingURL=Chevron.d.ts.map