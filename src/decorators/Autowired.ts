import { Chevron } from "../Chevron";

const Autowired = <TValue, UInitializer>(
    instance: Chevron<TValue, UInitializer>,
    name: UInitializer | string,
    context: any = null
) => (target: any, propertyKey: PropertyKey) => {
    target[propertyKey] = instance.get(name, context);
};

export { Autowired };
