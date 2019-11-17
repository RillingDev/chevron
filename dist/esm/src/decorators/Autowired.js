const Autowired = (instance, name, context = null) => (target, propertyKey) => {
    target[propertyKey] = instance.getInjectableInstance(name, context);
};
export { Autowired };
//# sourceMappingURL=Autowired.js.map