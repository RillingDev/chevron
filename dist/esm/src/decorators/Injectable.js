const Injectable = (instance, dependencies, options = {}) => (target) => {
    instance.registerInjectable(target, dependencies, options);
    return target;
};
export { Injectable };
//# sourceMappingURL=Injectable.js.map