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
        cv.set(
            InjectableType.SERVICE,
            [testFactoryName],
            testServiceFn,
            testServiceName
        );

        class TestFactoryClass {
            private readonly numberService: () => number;

            constructor(numberService: () => number) {
                this.numberService = numberService;
            }

            // noinspection JSUnusedGlobalSymbols
            public getVal() {
                return this.numberService();
            }
        }

        cv.set(
            InjectableType.FACTORY,
            [testServiceName],
            TestFactoryClass,
            testFactoryName
        );

        expect(() => cv.get(testFactoryName)).toThrowError(
            /Circular dependencies found.+/
        );
    });
});
