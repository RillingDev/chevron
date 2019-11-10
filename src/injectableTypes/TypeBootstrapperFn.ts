import { DependencyArr } from "../DependencyArr";

type TypeBootstrapperFn = <TDependencyValue>(
    initializer: any,
    dependencies: DependencyArr<TDependencyValue>
) => any;

export { TypeBootstrapperFn };
