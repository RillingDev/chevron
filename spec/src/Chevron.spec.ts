import { Chevron } from "../../src/Chevron";
import { DefaultBootstrappings } from "../../src/bootstrap/DefaultBootstrappings";

describe("Chevron tests", () => {
    it("Asserts that Chevron#get throws an exception for missing injectables", () => {
        expect(() => new Chevron().getInjectableInstance("foo")).toThrow();
    });

    it("Asserts that Chevron#set throws an exception when using a duplicate key", () => {
        const cv = new Chevron();

        const key = "foo";
        cv.registerInjectable(123, DefaultBootstrappings.FUNCTION, [], key);

        expect(() =>
            cv.registerInjectable(321, DefaultBootstrappings.FUNCTION, [], key)
        ).toThrowError(/Name already exists.+/);
    });
});
