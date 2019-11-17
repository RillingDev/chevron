import { bootstrapper } from "./bootstrap/bootstrapper";
import { scoper } from "./scope/scoper";
declare class Chevron<TValue = any, UInitializer = any> {
    private readonly injectables;
    constructor();
    get(name: UInitializer | string, context?: any): TValue;
    has(name: UInitializer | string): boolean;
    register(initializer: UInitializer, bootstrapFn?: bootstrapper<any, UInitializer, any>, dependencies?: string[], name?: string | null, scopeFn?: scoper<any, UInitializer, any>): void;
    private resolveEntry;
    private getKey;
}
export { Chevron };
//# sourceMappingURL=Chevron.d.ts.map