import {Chevron} from "src/Chevron";

describe("API usage: ", () => {
    const myChevron = new Chevron();

    myChevron.$.set("myEmtpyType", content => content);

    myChevron.set("myEmtpyTypeModule", "myEmtpyType", [], () => "foo");

    it("Custom empty type", () => {
        expect(myChevron.get("myEmtpyTypeModule")()).toBe("foo");
    });

    myChevron.$.set("myServiceLikeType", (content, dependencies) => function () {
        return content(...dependencies, ...arguments);
    });

    myChevron.set(
        "myServiceLikeModule",
        "myServiceLikeType",
        [],
        (foo: any) => foo + "bar"
    );

    it("Custom servicelike type", () => {
        expect(myChevron.get("myServiceLikeModule")("foo")).toBe("foobar");
    });
});
