import { serviceConstructorFn } from "../../src/constructors/serviceConstructorFn";

describe("serviceConstructor tests", () => {
    it("Asserts that serviceConstructor returns the wrapper function", () => {
        const result = 123;
        const testFn = () => result;

        expect(serviceConstructorFn(testFn, [])()).toBe(result);
    });

    it("Asserts that serviceConstructor returns the wrapper function when used with dependencies", () => {
        const result = 123;
        const testFn = (val: number) => val;

        expect(serviceConstructorFn(testFn, [result])()).toBe(result);
    });
});
