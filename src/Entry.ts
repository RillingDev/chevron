import { DependencyKeyArr } from "./DependencyKeyArr";
import { TypeBootstrapperFn } from "./injectableTypes/TypeBootstrapperFn";

interface Entry<TKey, UValue, VInit> {
    typeBootstrapper: TypeBootstrapperFn;
    dependencies: DependencyKeyArr<TKey>;
    initializer: VInit;
    content: UValue | null;
}

export { Entry };
