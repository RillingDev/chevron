/* tslint:disable:max-classes-per-file */
import { Chevron } from "../src/Chevron";
import { InjectableType } from "../src/injectableTypes/InjectableType";

describe("Chevron ITs", () => {
    it("Asserts that an error is thrown when resolving circular dependencies", () => {
        const cv = new Chevron();
        const result = 123;

        const testFactoryName = "testFactoryName";
        const testServiceName = "testServiceName";

        const testServiceFn = () => result;
        cv.set(testServiceName, InjectableType.SERVICE, [testFactoryName], testServiceFn);

        class TestFactoryClass {
            private readonly numberService: () => number;

            constructor(numberService: () => number) {
                this.numberService = numberService;
            }

            public getVal() {
                return this.numberService();
            }
        }

        cv.set(testFactoryName, InjectableType.FACTORY, [testServiceName], TestFactoryClass);

        expect(() => cv.get(testFactoryName)).toThrowError(/Circular dependencies were found.+/);
    });
});
