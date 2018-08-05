import { dependencyArr } from "../chevron";

const serviceConstructorFn = (content: any, dependencies: dependencyArr) =>
    // tslint-ignore
    function() {
        return content(...dependencies, ...arguments);
    };

export { serviceConstructorFn };
