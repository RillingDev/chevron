import { DependencyKeyArr } from "./DependencyKeyArr";
import { TypeBootstrapperFn } from "./injectableTypes/TypeBootstrapperFn";

interface Entry {
    typeBootstrapper: TypeBootstrapperFn;
    dependencies: DependencyKeyArr;
    initializer: any;
    content: any;
}

export { Entry };
