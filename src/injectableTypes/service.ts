import { DependencyArr } from "../DependencyArr";
import { TypeBootstrapperFn } from "./TypeBootstrapperFn";

/**
 * Built-in service bootstrapper.
 *
 * @private
 */
const serviceBootstrapper: TypeBootstrapperFn = <TResult, UDependencyValue>(
    initializer: (...args: any[]) => TResult,
    dependencies: DependencyArr<UDependencyValue>
): (() => TResult) =>
    function(...args) {
        return initializer(...dependencies, ...args);
    };

export { serviceBootstrapper };
