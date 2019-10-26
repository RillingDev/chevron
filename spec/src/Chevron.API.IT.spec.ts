import { Chevron } from "../../src/Chevron";

describe("Chevron API ITs", () => {
    it("Asserts that factories construct", () => {
        const cv = new Chevron();

        const MY_INJECTABLE_TYPE = "myType";
        cv.setType(MY_INJECTABLE_TYPE, (content, dependencies) => content * 2);

        const testInjectable = "testInjectable";
        const testVal = 123;
        cv.set(MY_INJECTABLE_TYPE, [], testVal, testInjectable);

        expect(cv.get(testInjectable)).toBe(246);
    });
});
