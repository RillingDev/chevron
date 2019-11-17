import { Chevron } from "../Chevron";

const Autowired = <TValue, UInitializer>(
    instance: Chevron<TValue, UInitializer>,
    name: UInitializer | string
) => (target: any, propertyKey: PropertyKey) => {
    target[propertyKey] = instance.get(name);
};

export { Autowired };
