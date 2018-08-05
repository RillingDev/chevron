import { dependencyArr } from "../chevron";

const serviceConstructorFn = (content: any, dependencies: dependencyArr) =>
    // tslint:disable-next-line:only-arrow-functions
    function() {
        return content(...dependencies, ...arguments);
    };

export { serviceConstructorFn };
