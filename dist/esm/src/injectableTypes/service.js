/**
 * Built-in service bootstrapper.
 *
 * @private
 */
const serviceBootstrapper = (initializer, dependencies) => function (...args) {
    return initializer(...dependencies, ...args);
};
export { serviceBootstrapper };
//# sourceMappingURL=service.js.map