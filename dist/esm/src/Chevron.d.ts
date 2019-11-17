import { bootstrapper } from "./bootstrap/bootstrapper";
declare class Chevron<TValue = any, UInitializer = any> {
    private readonly injectables;
    constructor();
    get(name: UInitializer | string): TValue;
    has(name: UInitializer | string): boolean;
    register(initializer: UInitializer, bootstrapFn?: bootstrapper<any, UInitializer, any>, dependencies?: string[], name?: string | null): void;
    private resolveEntry;
    private getKey;
}
export { Chevron };
//# sourceMappingURL=Chevron.d.ts.map