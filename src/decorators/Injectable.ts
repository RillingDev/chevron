import { Chevron } from "../Chevron";
import { dependencyDefinitionArr } from "../dependencyDefinitionArr";
import { InjectableType } from "../injectableTypes/InjectableType";

const Injectable = (
    instance: Chevron,
    name: string,
    type: InjectableType,
    dependencies: dependencyDefinitionArr
) => (target: any) => {
    instance.set(name, type, dependencies, target);
    return target;
};

export { Injectable };
