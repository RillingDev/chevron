import { bootstrapper } from "./bootstrap/bootstrapper";
import { scoper } from "./scope/scoper";
declare class Chevron<TValue = any, UInitializer = any> {
    private readonly injectables;
    constructor();
    getInjectableInstance(name: UInitializer | string, context?: any): TValue;
    hasInjectable(name: UInitializer | string): boolean;
    registerInjectable(initializer: UInitializer, bootstrapFn?: bootstrapper<any, UInitializer, any>, dependencies?: string[], name?: string | null, scopeFn?: scoper<any, UInitializer, any>): void;
    private resolveEntry;
    private getEntryName;
}
export { Chevron };
//# sourceMappingURL=Chevron.d.ts.map