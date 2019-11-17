import { Chevron } from "../../src/Chevron";
import { DefaultBootstrappers } from "../../src/bootstrap/DefaultBootstrappers";

describe("Chevron tests", () => {
    it("Asserts that Chevron#get throws an exception for missing injectables", () => {
        expect(() => new Chevron().get("foo")).toThrow();
    });

    it("Asserts that Chevron#set throws an exception when using a duplicate key", () => {
        const cv = new Chevron();

        const key = "foo";
        cv.register(123, DefaultBootstrappers.FUNCTION, [], key);

        expect(() =>
            cv.register(321, DefaultBootstrappers.FUNCTION, [], key)
        ).toThrowError(/Key already exists.+/);
    });
});
