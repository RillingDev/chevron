import { Chevron } from "../../src/Chevron";
import { Bootstrappers } from "../../src/bootstrap/Bootstrappers";

describe("Chevron tests", () => {
    it("Asserts that Chevron#get throws an exception for missing injectables", () => {
        expect(() => new Chevron().getInjectableInstance("foo")).toThrow();
    });

    it("Asserts that Chevron#set throws an exception when using a duplicate key", () => {
        const cv = new Chevron();

        const key = "foo";
        cv.registerInjectable(123, Bootstrappers.FUNCTION, [], key);

        expect(() =>
            cv.registerInjectable(321, Bootstrappers.FUNCTION, [], key)
        ).toThrowError(/Name already exists.+/);
    });
});
