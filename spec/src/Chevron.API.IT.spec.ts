import { Chevron } from "../../src/Chevron";

describe("Chevron API ITs", () => {
    it("Asserts that factories construct", () => {
        const cv = new Chevron();

        const testInjectable = "testInjectable";
        const testVal = 123;
        cv.registerInjectable(
            testVal,
            content => content * 2,
            [],
            testInjectable
        );

        expect(cv.getInjectableInstance(testInjectable)).toBe(246);
    });
});
