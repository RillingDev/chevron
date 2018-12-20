import { Chevron } from "../Chevron";
import { dependencyKeyArr } from "../dependencyKeyArr";
import { InjectableType } from "../injectableTypes/InjectableType";

/**
 * Decorator function to be used as TypeScript decorator
 * in order to declare a value to be an injectable which is added to the chevron instance.
 *
 * @param {Chevron} instance Chevron instance to use.
 * @param {string} type Type of the injectable.
 * @param {string[]} dependencies Array of dependency keys.
 * @param {*?} key Custom key of the injectable. If none is given, the initializer will be used.
 * @example
 * const cv = new Chevron();
 *
 * \@Injectable(cv, InjectableType.FACTORY, [])
 * class TestFactoryClass {
 *   public getVal() {
 *     return 123;
 *   }
 * }
 *
 * class ConsumerClass {
 *   \@Autowired(cv, TestFactoryClass)
 *   private readonly injectedDependency: any;
 *
 *   public getVal() {
 *     return this.injectedDependency.getVal();
 *   }
 * }
 *
 * @example
 * const cv = new Chevron();
 *
 * const testFactoryName = "testFactoryName";
 * \@Injectable(cv, InjectableType.FACTORY, [], testFactoryName)
 * class TestFactoryClass {
 *   public getVal() {
 *     return 123;
 *   }
 * }
 *
 * class ConsumerClass {
 *   \@Autowired(cv, testFactoryName)
 *   private readonly injectedDependency: any;
 *
 *   public getVal() {
 *     return this.injectedDependency.getVal();
 *   }
 * }
 */
const Injectable = (
    instance: Chevron,
    type: InjectableType,
    dependencies: dependencyKeyArr,
    key?: any
) => (target: any) => {
    instance.set(type, dependencies, target, key);
    return target;
};

export { Injectable };
