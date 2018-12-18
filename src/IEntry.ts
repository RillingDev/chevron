import { dependencyDefinitionArr } from "./dependencyDefinitionArr";
import { typeBootstrapperFn } from "./injectableTypes/typeBootstrapperFn";

interface IEntry {
    typeBootstrapper: typeBootstrapperFn;
    dependencies: dependencyDefinitionArr;
    initializer: any;
    content: any;
}

export { IEntry };
