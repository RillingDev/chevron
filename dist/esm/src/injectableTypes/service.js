/**
 * Built-in service bootstrapper.
 *
 * @private
 */
const serviceBootstrapper = (initializer, dependencies) => 
// tslint:disable-next-line:only-arrow-functions
function () {
    return initializer(...dependencies, ...arguments);
};
export { serviceBootstrapper };
//# sourceMappingURL=service.js.map