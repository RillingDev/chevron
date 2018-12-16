import { Chevron } from "../Chevron";
import { dependencyDefinitionArr } from "../dependencyDefinitionArr";
import { InjectableType } from "../injectableTypes/InjectableType";

/**
 * Decorator function to be used with TypeScript decorators
 * in order to declare a value to be an injectable which is added to the chevron instance.
 *
 * This is not exported with the main JS files as it only is useful with TypeScript.
 *
 * @param {Chevron} instance Chevron instance to use.
 * @param {string} name Name of the injectable.
 * @param {string} type Type of the injectable.
 * @param {string[]} dependencies Array of dependency names.
 * @example
 * const cv = new Chevron();
 *
 * const testFactoryName = "testFactoryName";
 * @Injectable(cv, testFactoryName, InjectableType.FACTORY, [])
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
const Injectable = (
    instance: Chevron,
    name: string,
    type: InjectableType,
    dependencies: dependencyDefinitionArr
) => (target: any) => {
    instance.set(name, type, dependencies, target);
    return target;
};

export { Injectable };
