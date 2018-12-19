import { dependencyArr } from "../dependencyArr";

type typeBootstrapperFn = (
    initializer: any,
    dependencies: dependencyArr
) => any;

export { typeBootstrapperFn };
