import { typeBootstrapperFn } from "./typeBootstrapperFn";

/**
 * Built-in plainBootstrapper constructor.
 *
 * @private
 * @param {*} content
 */
const plainBootstrapper: typeBootstrapperFn = <T>(content: T): T => content;

export { plainBootstrapper };
