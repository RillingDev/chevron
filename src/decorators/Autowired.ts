import { Chevron } from "../Chevron";

/**
 * Decorator function to be used with TypeScript decorators
 * in order to wire an injectable into a class property.
 *
 * This is not exported with the main JS files as it only is useful with TypeScript.
 *
 * @public
 * @param {Chevron} instance Chevron instance to use.
 * @param {*} key Key of the injectable.
 * @example
 * const cv = new Chevron();
 *
 * @Injectable(cv, InjectableType.FACTORY, [])
 * class TestFactoryClass {
 *   public getVal() {
 *     return 123;
 *   }
 * }
 *
 * class ConsumerClass {
 *   @Autowired(cv, TestFactoryClass)
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
 * @Injectable(cv, InjectableType.FACTORY, [], testFactoryName)
 * class TestFactoryClass {
 *   public getVal() {
 *     return 123;
 *   }
 * }
 *
 * class ConsumerClass {
 *   @Autowired(cv, testFactoryName)
 *   private readonly injectedDependency: any;
 *
 *   public getVal() {
 *     return this.injectedDependency.getVal();
 *   }
 * }
 */
const Autowired = (instance: Chevron, key: any) => (
    target: any,
    propertyKey: string | symbol
) => {
    target[propertyKey] = instance.get(key);
};

export { Autowired };
