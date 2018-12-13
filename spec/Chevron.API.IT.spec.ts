import { Chevron } from "../src/Chevron";

describe("Chevron API ITs", () => {
    it("Asserts that factories construct", () => {
        const cv = new Chevron();
        const result = 123;

        const testTypeName = "testType";
        const testTypeFn = (content: any) => content;
        cv.$.set(testTypeName, testTypeFn);

        const testInjectableName = "testFactoryName";
        // tslint:disable-next-line:max-classes-per-file
        cv.set(testInjectableName, testTypeName, [], result);

        expect(cv.get(testInjectableName)).toBe(result);
    });
});
