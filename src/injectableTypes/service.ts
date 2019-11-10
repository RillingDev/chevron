import { DependencyArr } from "../DependencyArr";
import { TypeBootstrapperFn } from "./TypeBootstrapperFn";

/**
 * Built-in service bootstrapper.
 *
 * @private
 */
const serviceBootstrapper: TypeBootstrapperFn = <T, UDependencyValue>(
    initializer: (...args: any[]) => T,
    dependencies: DependencyArr<UDependencyValue>
): (() => T) =>
    function(...args) {
        return initializer(...dependencies, ...args);
    };

export { serviceBootstrapper };
