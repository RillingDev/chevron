import { dependencyDefinitionArr } from "../dependencyDefinitionArr";

type typeBootstrapperFn = (
    initializer: any,
    dependencies: dependencyDefinitionArr
) => any;

export { typeBootstrapperFn };
