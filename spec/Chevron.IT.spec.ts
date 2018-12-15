/* tslint:disable:max-classes-per-file */
import { Chevron } from "../src/Chevron";
import { InjectableType } from "../src/injectableTypes/InjectableType";

describe("Chevron ITs", () => {
    it("Asserts that services construct", () => {
        const cv = new Chevron();
        const result = 123;

        const testServiceName = "testServiceName";
        const testServiceFn = () => result;
        cv.set(testServiceName, InjectableType.SERVICE, [], testServiceFn);

        expect(cv.get(testServiceName)()).toBe(result);
    });

    it("Asserts that factories construct", () => {
        const cv = new Chevron();
        const result = 123;

        const testFactoryName = "testFactoryName";

        class TestFactoryClass {
            public getVal() {
                return result;
            }
        }

        cv.set(testFactoryName, InjectableType.FACTORY, [], TestFactoryClass);

        expect(cv.get(testFactoryName).getVal()).toBe(result);
    });

    it("Asserts that single layer dependencies are resolved", () => {
        const cv = new Chevron();
        const result = 123;

        const testServiceName = "testServiceName";
        const testServiceFn = () => result;
        cv.set(testServiceName, InjectableType.SERVICE, [], testServiceFn);

        const testFactoryName = "testFactoryName";

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

        expect(cv.get(testFactoryName).getVal()).toBe(result);
    });

    it("Asserts that multi layer dependencies are resolved", () => {
        const cv = new Chevron();
        const result = 123;

        const testService1Name = "testService1Name";
        const testService1Fn = () => result;
        cv.set(testService1Name, InjectableType.SERVICE, [], testService1Fn);

        const testFactoryName1 = "testFactoryName1";

        class TestFactoryClass1 {
            public isAllowed() {
                return true;
            }
        }

        cv.set(testFactoryName1, InjectableType.FACTORY, [], TestFactoryClass1);

        const testService2Name = "testService2Name";
        const testService2Fn = (testService1: any, testFactory1: any) => {
            if (!testFactory1.isAllowed()) {
                throw new Error("Oh no!");
            }

            return testService1();
        };
        cv.set(
            testService2Name,
            InjectableType.SERVICE,
            [testService1Name, testFactoryName1],
            testService2Fn
        );

        const testFactoryName2 = "testFactoryName2";
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
            InjectableType.FACTORY,
            [testService2Name],
            TestFactoryClass2
        );

        expect(cv.get(testFactoryName2).getVal()).toBe(result);
    });
});
