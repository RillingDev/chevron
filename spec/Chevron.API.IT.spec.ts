import { Chevron } from "../src/Chevron";

describe("Chevron API ITs", () => {
    it("Asserts that factories construct", () => {
        const cv = new Chevron();
        const result = 123;

        const testTypeName = "testType";
        const testTypeFn = (content: any) => content;
        cv.setType(testTypeName, testTypeFn);

        const testInjectableName = "testFactoryName";
        cv.set(testInjectableName, testTypeName, [], result);

        expect(cv.get(testInjectableName)).toBe(result);
    });
});
