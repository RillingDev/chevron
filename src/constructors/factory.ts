import { dependencyArr } from "../chevron";

const factoryConstructorFn = (content: any, dependencies: dependencyArr) =>
    new (Function.prototype.bind.apply(content, ["", ...dependencies]))();

export { factoryConstructorFn };
