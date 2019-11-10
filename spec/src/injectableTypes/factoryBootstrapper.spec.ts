import { factoryBootstrapper } from "../../../src/injectableTypes/factory";

describe("factoryBootstrapper tests", () => {
    it("Asserts that factoryBootstrapper constructs a class", () => {
        const result = 123;

        class TestClass {
            private readonly val: number;

            public constructor() {
                this.val = result;
            }

            public getVal(): number {
                return this.val;
            }
        }

        expect(factoryBootstrapper(TestClass, []).getVal()).toBe(result);
    });

    it("Asserts that factoryBootstrapper constructs a class with dependencies", () => {
        const result = 123;

        class TestClass {
            private readonly val: number;

            public constructor(val: number) {
                this.val = val;
            }

            public getVal(): number {
                return this.val;
            }
        }

        expect(factoryBootstrapper(TestClass, [result]).getVal()).toBe(result);
    });
});
