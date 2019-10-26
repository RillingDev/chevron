/**
 * Built-in factory bootstrapper.
 *
 * @private
 */
const factoryBootstrapper = (initializer, dependencies) => Reflect.construct(initializer, dependencies);
export { factoryBootstrapper };
//# sourceMappingURL=factory.js.map