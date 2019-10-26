/**
 * Decorator function to be used as TypeScript decorator
 * in order to wire an injectable into a class property.
 *
 * @public
 * @param {Chevron} instance Chevron instance to use.
 * @param {*} key Key of the injectable.
 */
const Autowired = (instance, key) => (target, propertyKey) => {
    target[propertyKey] = instance.get(key);
};
export { Autowired };
//# sourceMappingURL=Autowired.js.map