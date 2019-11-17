import { Chevron } from "../Chevron";

const Autowired = <TValue, UInitializer>(
    instance: Chevron<TValue, UInitializer>,
    name: UInitializer | string,
    context: any = null
) => (target: any, propertyKey: PropertyKey) => {
    target[propertyKey] = instance.getInjectableInstance(name, context);
};

export { Autowired };
