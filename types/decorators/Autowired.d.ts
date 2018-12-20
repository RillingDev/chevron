import { Chevron } from "../Chevron";
/**
 * Decorator function to be used as TypeScript decorator
 * in order to wire an injectable into a class property.
 *
 * @public
 * @param {Chevron} instance Chevron instance to use.
 * @param {*} key Key of the injectable.
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
declare const Autowired: (instance: Chevron, key: any) => (target: any, propertyKey: string | symbol) => void;
export { Autowired };
