import { Chevron } from "../../src/Chevron";
import { DefaultBootstrappings } from "../../src/bootstrap/DefaultBootstrappings";

describe("Chevron ITs", () => {
    it("Asserts that an error is thrown when resolving circular dependencies", () => {
        const cv = new Chevron();
        const result = 123;

        const testFactoryName = "testFactoryName";
        const testServiceName = "testServiceName";

        const testServiceFn: () => number = () => result;
        cv.registerInjectable(
            testServiceFn,
            DefaultBootstrappings.FUNCTION,
            [testFactoryName],
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

        cv.registerInjectable(
            TestFactoryClass,
            DefaultBootstrappings.CLASS,
            [testServiceName],
            testFactoryName
        );

        expect(() => cv.getInjectableInstance(testFactoryName)).toThrowError(
            /Circular dependencies found.+/
        );
    });
});
