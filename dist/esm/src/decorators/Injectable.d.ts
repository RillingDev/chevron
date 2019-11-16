import { Chevron } from "../Chevron";
import { bootstrapper } from "../bootstrap/bootstrapper";
/**
 * Decorator function to be used as TypeScript decorator
 * in order to declare a value to be an injectable which is added to the chevron instance.
 *
 * @param {Chevron} instance Chevron instance to use.
 * @param {string[]} dependencies Array of dependency keys.
 */
declare const Injectable: <TValue = any, UInitializer = any>(instance: Chevron<TValue, UInitializer>, bootstrapFn?: bootstrapper<any, UInitializer, any>, dependencies?: string[], name?: string | null) => (target: any) => any;
export { Injectable };
//# sourceMappingURL=Injectable.d.ts.map