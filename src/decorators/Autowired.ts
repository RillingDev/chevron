import { Chevron } from "../Chevron";

const Autowired = (instance: Chevron, name: string) => (
    target: any,
    propertyKey: string | symbol
) => {
    target[propertyKey] = instance.get(name);
};

export { Autowired };
