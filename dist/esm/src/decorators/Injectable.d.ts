import { Chevron } from "../Chevron";
import { DependencyKeyArr } from "../DependencyKeyArr";
import { InjectableType } from "../injectableTypes/InjectableType";
/**
 * Decorator function to be used as TypeScript decorator
 * in order to declare a value to be an injectable which is added to the chevron instance.
 *
 * @param {Chevron} instance Chevron instance to use.
 * @param {string} type Type of the injectable.
 * @param {string[]} dependencies Array of dependency keys.
 * @param {*?} key Custom key of the injectable. If none is given, the initializer will be used.
 */
declare const Injectable: <TKey>(instance: Chevron<TKey>, type: InjectableType, dependencies: DependencyKeyArr<TKey>, key?: TKey | undefined) => (target: any) => any;
export { Injectable };
//# sourceMappingURL=Injectable.d.ts.map