const Autowired = (instance, name) => (target, propertyKey) => {
    target[propertyKey] = instance.get(name);
};
export { Autowired };
//# sourceMappingURL=Autowired.js.map