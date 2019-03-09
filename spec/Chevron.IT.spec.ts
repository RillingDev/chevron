/* tslint:disable:max-classes-per-file */
import { Chevron } from "../src/Chevron";
import { InjectableType } from "../src/injectableTypes/InjectableType";

describe("Chevron ITs", () => {
    it("Asserts that plains construct", () => {
        const cv = new Chevron();
        const result = 123;

        const testPlainName = "testPlainName";
        cv.set(InjectableType.PLAIN, [], result, testPlainName);

        expect(cv.get(testPlainName)).toBe(result);
    });

    it("Asserts that services construct", () => {
        const cv = new Chevron();
        const result = 123;

        const testServiceName = "testServiceName";
        const testServiceFn = () => result;
        cv.set(InjectableType.SERVICE, [], testServiceFn, testServiceName);

        expect(cv.get(testServiceName)()).toBe(result);
    });

    it("Asserts that factories construct", () => {
        const cv = new Chevron();
        const result = 123;

        const testFactoryName = "testFactoryName";

        class TestFactoryClass {
            // noinspection JSMethodCanBeStatic
            public getVal() {
                return result;
            }
        }

        cv.set(InjectableType.FACTORY, [], TestFactoryClass, testFactoryName);

        expect(cv.get(testFactoryName).getVal()).toBe(result);
    });

    it("Asserts that single layer dependencies are resolved", () => {
        const cv = new Chevron();
        const result = 123;

        const testServiceName = "testServiceName";
        const testServiceFn = () => result;
        cv.set(InjectableType.SERVICE, [], testServiceFn, testServiceName);

        const testFactoryName = "testFactoryName";

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

        expect(cv.get(testFactoryName).getVal()).toBe(result);
    });

    it("Asserts that multi layer dependencies are resolved", () => {
        const cv = new Chevron();
        const result = 123;

        const testService1Name = "testService1Name";
        const testService1Fn = () => result;
        cv.set(InjectableType.SERVICE, [], testService1Fn, testService1Name);

        const testFactoryName1 = "testFactoryName1";

        class TestFactoryClass1 {
            // noinspection JSMethodCanBeStatic
            public isAllowed() {
                return true;
            }
        }

        cv.set(InjectableType.FACTORY, [], TestFactoryClass1, testFactoryName1);

        const testService2Name = "testService2Name";
        const testService2Fn = (testService1: any, testFactory1: any) => {
            if (!testFactory1.isAllowed()) {
                throw new Error("Oh no!");
            }

            return testService1();
        };
        cv.set(
            InjectableType.SERVICE,
            [testService1Name, testFactoryName1],
            testService2Fn,
            testService2Name
        );

        const testFactoryName2 = "testFactoryName2";
        const TestFactoryClass2 = class {
            private readonly numberService: () => number;

            constructor(numberService: () => number) {
                this.numberService = numberService;
            }

            // noinspection JSUnusedGlobalSymbols
            public getVal() {
                return this.numberService();
            }
        };
        cv.set(
            InjectableType.FACTORY,
            [testService2Name],
            TestFactoryClass2,
            testFactoryName2
        );

        expect(cv.get(testFactoryName2).getVal()).toBe(result);
    });

    it("Asserts that non-string keys construct", () => {
        const cv = new Chevron();
        const result = 123;

        class TestFactoryClass {
            // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
            public getVal() {
                return result;
            }
        }

        cv.set(InjectableType.FACTORY, [], TestFactoryClass, TestFactoryClass);

        expect(cv.get(TestFactoryClass).getVal()).toBe(result);
    });

    it("Asserts that the key can be inferred from the initializer", () => {
        const cv = new Chevron();
        const result = 123;

        class TestFactoryClass {
            // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
            public getVal() {
                return result;
            }
        }

        cv.set(InjectableType.FACTORY, [], TestFactoryClass);

        expect(cv.get(TestFactoryClass).getVal()).toBe(result);
    });
});
