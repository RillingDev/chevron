import { Chevron } from "../src/Chevron";
import { InjectableType } from "../src/injectableTypes/InjectableType";

describe("Chevron tests", () => {
    it("Asserts that Chevron#get throws an exception for missing injectables", () => {
        expect(() => new Chevron().get("foo")).toThrow();
    });

    it("Asserts that Chevron#set throws an exception when using an unknown type", () => {
        expect(() =>
            new Chevron().set("myUnknown", "unknown", [], 123)
        ).toThrow();
    });

    it(
        "Asserts that Chevron initialises with the types 'service' and 'factory'" +
        " and does not throw any exceptions when using them",
        () => {
            const cv = new Chevron();

            cv.set("myService", InjectableType.SERVICE, [], 123);
            cv.set("myFactory", InjectableType.FACTORY, [], 321);
        }
    );
});
