import { factoryConstructorFn } from "../../src/constructors/factoryConstructorFn";

describe("factoryConstructor tests", () => {
    it("Asserts that factoryConstructor constructs a class", () => {
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

        expect(factoryConstructorFn(TestClass, []).getVal()).toBe(result);
    });

    it("Asserts that factoryConstructor constructs a class with dependencies", () => {
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

        expect(factoryConstructorFn(TestClass, [result]).getVal()).toBe(result);
    });
});
