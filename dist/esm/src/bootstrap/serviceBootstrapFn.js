import { isFunction } from "lodash";
function serviceBootstrapFn(value, dependencies) {
    if (!isFunction(value)) {
        throw new TypeError("Non-functions cannot be bootstrapped by this bootstrapper.");
    }
    return value(...dependencies);
}
export { serviceBootstrapFn };
//# sourceMappingURL=serviceBootstrapFn.js.map