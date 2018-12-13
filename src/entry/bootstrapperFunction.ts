import { dependencyDefinitionArr } from "../dependency/dependencyDefinitionArr";

type bootstrapperFunction = (
    content: any,
    dependencies: dependencyDefinitionArr
) => any;

export { bootstrapperFunction };
