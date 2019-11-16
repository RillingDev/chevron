import { Chevron } from "../../src/Chevron";
import {
    classBootstrapper,
    functionBootstrapper,
    identityBootstrapper
} from "../../src/main";

describe("Chevron IT", () => {
    it("Asserts that plains construct", () => {
        const cv = new Chevron();
        const result = 123;

        const testPlainName = "testPlainName";
        cv.register(result, identityBootstrapper, [], testPlainName);

        expect(cv.get(testPlainName)).toBe(result);
    });

    it("Asserts that services construct", () => {
        const cv = new Chevron();
        const result = 123;

        const testServiceName = "testServiceName";
        const testServiceFn: () => number = () => result;
        cv.register(testServiceFn, functionBootstrapper, [], testServiceName);

        expect(cv.get(testServiceName)()).toBe(result);
    });

    it("Asserts that factories construct", () => {
        const cv = new Chevron();
        const result = 123;

        const testFactoryName = "testFactoryName";

        class TestFactoryClass {
            public getVal(): number {
                return result;
            }
        }

        cv.register(TestFactoryClass, classBootstrapper, [], testFactoryName);

        expect(cv.get(testFactoryName).getVal()).toBe(result);
    });

    it("Asserts that single layer dependencies are resolved", () => {
        const cv = new Chevron();
        const result = 123;

        const testServiceName = "testServiceName";
        const testServiceFn: () => number = () => result;
        cv.register(testServiceFn, functionBootstrapper, [], testServiceName);

        const testFactoryName = "testFactoryName";

        class TestFactoryClass {
            private readonly numberGenerator: () => number;

            public constructor(numberService: () => number) {
                this.numberGenerator = numberService;
            }

            public getVal(): number {
                return this.numberGenerator();
            }
        }

        cv.register(
            TestFactoryClass,
            classBootstrapper,
            [testServiceName],
            testFactoryName
        );

        expect(cv.get(testFactoryName).getVal()).toBe(result);
    });

    it("Asserts that multi layer dependencies are resolved", () => {
        const cv = new Chevron();
        const result = 123;

        const testService1Name = "testService1Name";
        const testService1Fn: () => number = () => result;
        cv.register(testService1Fn, functionBootstrapper, [], testService1Name);

        const testFactoryName1 = "testFactoryName1";

        class TestFactoryClass1 {
            public isAllowed(): boolean {
                return true;
            }
        }

        cv.register(TestFactoryClass1, classBootstrapper, [], testFactoryName1);

        const testService2Name = "testService2Name";
        const testService2Fn: (testService1: any, testFactory1: any) => any = (
            testService1,
            testFactory1
        ) => {
            if (!testFactory1.isAllowed()) {
                throw new Error("Oh no!");
            }

            return testService1();
        };
        cv.register(
            testService2Fn,
            functionBootstrapper,
            [testService1Name, testFactoryName1],
            testService2Name
        );

        const testFactoryName2 = "testFactoryName2";
        const TestFactoryClass2 = class {
            private readonly numberService: () => number;

            public constructor(numberService: () => number) {
                this.numberService = numberService;
            }

            public getVal(): number {
                return this.numberService();
            }
        };
        cv.register(
            TestFactoryClass2,
            classBootstrapper,
            [testService2Name],
            testFactoryName2
        );

        expect(cv.get(testFactoryName2).getVal()).toBe(result);
    });
    it("Asserts that the key can be inferred from the initializer", () => {
        const cv = new Chevron();
        const result = 123;

        class TestFactoryClass {
            public getVal(): number {
                return result;
            }
        }

        cv.register(TestFactoryClass, classBootstrapper, [], undefined);

        expect(cv.get(TestFactoryClass).getVal()).toBe(result);
    });
});
