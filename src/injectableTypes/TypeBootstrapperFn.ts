import { DependencyArr } from "../DependencyArr";

type TypeBootstrapperFn = (
    initializer: any,
    dependencies: DependencyArr
) => any;

export { TypeBootstrapperFn };
