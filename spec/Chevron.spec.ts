import { Chevron } from "../src/Chevron";
import { InjectableType } from "../src/injectableTypes/InjectableType";

describe("Chevron tests", () => {
    it("Asserts that Chevron#get throws an exception for missing injectables", () => {
        expect(() => new Chevron().get("foo")).toThrow();
    });

    it("Asserts that Chevron#set throws an exception when using a duplicate key", () => {
        const cv = new Chevron();

        const key = "foo";
        cv.set(InjectableType.SERVICE, [], 123, key);

        expect(() => cv.set(InjectableType.SERVICE, [], 321, key)).toThrowError(
            /Key already exists.+/
        );
    });

    it("Asserts that Chevron#set throws an exception when using an unknown type", () => {
        expect(() =>
            new Chevron().set("unknown", [], 123, "myUnknown")
        ).toThrowError(/Missing type.+/);
    });

    it("Asserts that Chevron initialises with the types 'plain', 'service' and 'factory'", () => {
        const cv = new Chevron();

        expect(cv.hasType(InjectableType.PLAIN)).toBeTruthy();
        expect(cv.hasType(InjectableType.SERVICE)).toBeTruthy();
        expect(cv.hasType(InjectableType.FACTORY)).toBeTruthy();

        expect(cv.hasType("unknown")).toBeFalsy();
    });
});
