import { bootstrapperFunction } from "./bootstrapperFunction";

/**
 * Built-in plainBootstrapper constructor.
 *
 * @private
 * @param {*} content
 */
const plainBootstrapper: bootstrapperFunction = <T>(content: T): T => content;

export { plainBootstrapper };
