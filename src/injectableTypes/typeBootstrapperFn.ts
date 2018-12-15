import { dependencyDefinitionArr } from "../dependencyDefinitionArr";

type typeBootstrapperFn = (
    content: any,
    dependencies: dependencyDefinitionArr
) => any;

export { typeBootstrapperFn };
