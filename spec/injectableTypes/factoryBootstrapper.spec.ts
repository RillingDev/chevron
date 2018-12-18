/* tslint:disable:max-classes-per-file */
import { dependencyArr } from "../../src/dependencyArr";
import { factoryBootstrapper } from "../../src/injectableTypes/factory";

describe("factoryBootstrapper tests", () => {
    it("Asserts that factoryBootstrapper constructs a class", () => {
        const result = 123;

        class TestClass {
            private readonly val: number;

            constructor() {
                this.val = result;
            }

            public getVal() {
                return this.val;
            }
        }

        expect(factoryBootstrapper(TestClass, []).getVal()).toBe(result);
    });

    it("Asserts that factoryBootstrapper constructs a class with dependencies", () => {
        const result = 123;

        class TestClass {
            private readonly val: number;

            constructor(val: number) {
                this.val = val;
            }

            // noinspection JSUnusedGlobalSymbols
            public getVal() {
                return this.val;
            }
        }

        expect(
            factoryBootstrapper(TestClass, <dependencyArr>[result]).getVal()
        ).toBe(result);
    });
});
