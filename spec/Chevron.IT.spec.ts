import { Chevron } from "../src/Chevron";

describe("Chevron ITs", () => {
    it("Asserts that services construct", () => {
        const cv = new Chevron();
        const result = 123;

        const testServiceName = "testServiceName";
        const testServiceFn = () => result;
        cv.set(testServiceName, "service", [], testServiceFn);

        expect(cv.get(testServiceName)()).toBe(result);
    });

    it("Asserts that factories construct", () => {
        const cv = new Chevron();
        const result = 123;

        const testFactoryName = "testFactoryName";
        // tslint:disable-next-line:max-classes-per-file
        const TestFactoryClass = class {
            public getVal() {
                return result;
            }
        };
        cv.set(testFactoryName, "factory", [], TestFactoryClass);

        expect(cv.get(testFactoryName).getVal()).toBe(result);
    });

    it("Asserts that single layer dependencies are resolved", () => {
        const cv = new Chevron();
        const result = 123;

        const testServiceName = "testServiceName";
        const testServiceFn = () => result;
        cv.set(testServiceName, "service", [], testServiceFn);

        const testFactoryName = "testFactoryName";
        // tslint:disable-next-line:max-classes-per-file
        const TestFactoryClass = class {
            private readonly numberService: () => number;

            constructor(numberService: () => number) {
                this.numberService = numberService;
            }

            public getVal() {
                return this.numberService();
            }
        };
        cv.set(testFactoryName, "factory", [testServiceName], TestFactoryClass);

        expect(cv.get(testFactoryName).getVal()).toBe(result);
    });

    it("Asserts that multi layer dependencies are resolved", () => {
        const cv = new Chevron();
        const result = 123;

        const testService1Name = "testService1Name";
        const testService1Fn = () => result;
        cv.set(testService1Name, "service", [], testService1Fn);

        const testFactoryName1 = "testFactoryName1";
        // tslint:disable-next-line:max-classes-per-file
        const TestFactoryClass1 = class {
            public isAllowed() {
                return true;
            }
        };
        cv.set(testFactoryName1, "factory", [], TestFactoryClass1);

        const testService2Name = "testService2Name";
        const testService2Fn = (testService1: any, testFactory1: any) => {
            if (!testFactory1.isAllowed()) {
                throw new Error("Oh no!");
            }

            return testService1();
        };
        cv.set(
            testService2Name,
            "service",
            [testService1Name, testFactoryName1],
            testService2Fn
        );

        const testFactoryName2 = "testFactoryName2";
        // tslint:disable-next-line:max-classes-per-file
        const TestFactoryClass2 = class {
            private readonly numberService: () => number;

            constructor(numberService: () => number) {
                this.numberService = numberService;
            }

            public getVal() {
                return this.numberService();
            }
        };
        cv.set(
            testFactoryName2,
            "factory",
            [testService2Name],
            TestFactoryClass2
        );

        expect(cv.get(testFactoryName2).getVal()).toBe(result);
    });
});
