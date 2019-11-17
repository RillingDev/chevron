import { Chevron } from "../Chevron";
import { bootstrapper } from "../bootstrap/bootstrapper";
import { scoper } from "../scope/scoper";
declare const Injectable: <TValue = any, UInitializer = any, VContext = any>(instance: Chevron<TValue, UInitializer, any>, bootstrapFn?: bootstrapper<any, UInitializer, any>, dependencies?: string[], name?: string | null, scopeFn?: scoper<any, UInitializer, any, VContext>) => (target: any) => any;
export { Injectable };
//# sourceMappingURL=Injectable.d.ts.map