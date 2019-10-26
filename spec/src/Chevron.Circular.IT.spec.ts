import { Chevron } from "../../src/Chevron";
import { InjectableType } from "../../src/injectableTypes/InjectableType";

describe("Chevron ITs", () => {
    it("Asserts that an error is thrown when resolving circular dependencies", () => {
        const cv = new Chevron();
        const result = 123;

        const testFactoryName = "testFactoryName";
        const testServiceName = "testServiceName";

        const testServiceFn: () => number = () => result;
        cv.set(
            InjectableType.SERVICE,
            [testFactoryName],
            testServiceFn,
            testServiceName
        );

        class TestFactoryClass {
            private readonly numberService: () => number;

            public constructor(numberService: () => number) {
                this.numberService = numberService;
            }

            public getVal(): number {
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
