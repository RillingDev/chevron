/**
 * Built-in service constructor.
 *
 * @private
 * @param {*} content
 * @param {Array<*>} dependencies
 */
declare const serviceConstructorFn: (content: any, dependencies: any[]) => () => any;
export { serviceConstructorFn };
