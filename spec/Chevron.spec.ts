import { Chevron } from "../src/Chevron";
import { InjectableType } from "../src/injectableTypes/InjectableType";

describe("Chevron tests", () => {
    it("Asserts that Chevron#get throws an exception for missing injectables", () => {
        expect(() => new Chevron().get("foo")).toThrow();
    });

    it("Asserts that Chevron#set throws an exception when using a duplicate key", () => {
        const cv = new Chevron();

        cv.set("service", [], 123, "foo");

        expect(() => cv.set(InjectableType.SERVICE, [], 321, "foo")).toThrowError(
            /Key already exists.+/
        );
    });

    it("Asserts that Chevron#set throws an exception when using an unknown type", () => {
        expect(() =>
            new Chevron().set("unknown", [], 123, "myUnknown")
        ).toThrowError(/Missing type.+/);
    });

    it(
        "Asserts that Chevron initialises with the types 'service' and 'factory'" +
        " and does not throw any exceptions when using them",
        () => {
            const cv = new Chevron();

            cv.set(InjectableType.SERVICE, [], 123, "myService");
            cv.set(InjectableType.FACTORY, [], 321, "myFactory");
        }
    );
});
