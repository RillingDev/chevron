import { dependencyDefinitionArr } from "../dependencyDefinitionArr";

type bootstrapperFunction = (
    content: any,
    dependencies: dependencyDefinitionArr
) => any;

export { bootstrapperFunction };
