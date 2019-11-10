import { TypeBootstrapperFn } from "./TypeBootstrapperFn";

/**
 * Built-in plain bootstrapper.
 *
 * @private
 */
const plainBootstrapper: TypeBootstrapperFn = <TResult>(
    initializer: TResult
): TResult => initializer;

export { plainBootstrapper };
