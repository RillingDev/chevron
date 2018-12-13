import { factoryBootstrapper } from "../../src/injectableTypes/factory";
import { dependencyArr } from "../../src/dependency/dependencyArr";

describe("factoryBootstrapper tests", () => {
    it("Asserts that factoryBootstrapper constructs a class", () => {
        const result = 123;
        // tslint:disable-next-line:max-classes-per-file
        const TestClass = class {
            private readonly val: number;

            constructor() {
                this.val = result;
            }

            public getVal() {
                return this.val;
            }
        };

        expect(factoryBootstrapper(TestClass, []).getVal()).toBe(result);
    });

    it("Asserts that factoryBootstrapper constructs a class with dependencies", () => {
        const result = 123;
        // tslint:disable-next-line:max-classes-per-file
        const TestClass = class {
            private readonly val: number;

            constructor(val: number) {
                this.val = val;
            }

            public getVal() {
                return this.val;
            }
        };

        expect(
            factoryBootstrapper(TestClass, <dependencyArr>[result]).getVal()
        ).toBe(result);
    });
});
