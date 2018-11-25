import { Chevron } from "src/Chevron";

describe("API usage: ", () => {
    const myChevron = new Chevron();

    myChevron.$.set("myEmptyType", content => content);

    myChevron.set("myEmptyTypeModule", "myEmptyType", [], () => "foo");

    it("Custom empty type", () => {
        expect(myChevron.get("myEmptyTypeModule")()).toBe("foo");
    });

    myChevron.$.set(
        "myServiceLikeType",
        (content, dependencies) =>
            // tslint:disable-next-line:only-arrow-functions
            function() {
                return content(...dependencies, ...arguments);
            }
    );

    myChevron.set(
        "myServiceLikeModule",
        "myServiceLikeType",
        [],
        (foo: any) => foo + "bar"
    );

    it("Custom service-like type", () => {
        expect(myChevron.get("myServiceLikeModule")("foo")).toBe("foobar");
    });
});
