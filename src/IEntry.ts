import { dependencyKeyArr } from "./dependencyKeyArr";
import { typeBootstrapperFn } from "./injectableTypes/typeBootstrapperFn";

interface IEntry {
    typeBootstrapper: typeBootstrapperFn;
    dependencies: dependencyKeyArr;
    initializer: any;
    content: any;
}

export { IEntry };
