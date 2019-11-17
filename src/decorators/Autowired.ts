import { Chevron } from "../Chevron";

const Autowired = <TValue = any, UInitializer = any, VContext = any>(
    instance: Chevron<TValue, UInitializer, VContext>,
    name: UInitializer | string,
    context: VContext | null = null
) => (target: any, propertyKey: PropertyKey) => {
    target[propertyKey] = instance.getInjectableInstance(name, context);
};

export { Autowired };
