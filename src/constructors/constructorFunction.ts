import { dependencyDefArr } from "../dependency/dependencyDefArr";

type constructorFunction = (
    content: any,
    dependencies: dependencyDefArr
) => any;

export { constructorFunction };
