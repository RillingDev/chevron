const Chevron = require("../dist/chevron.common.js");
const myChevron = new Chevron();

describe("API usage: ", () => {
    myChevron.$.set("myEmtpyType", content => content);

    myChevron.set("myEmtpyTypeModule", "myEmtpyType", [], function() {
        return "foo";
    });

    it("Custom empty type", () => {
        expect(myChevron.get("myEmtpyTypeModule")()).toBe("foo");
    });

    myChevron.$.set(
        "myServiceLikeType",
        (content, dependencies) =>
            // tslint-ignore
            function() {
                return content(...dependencies, ...arguments);
            }
    );

    myChevron.set("myServiceLikeModule", "myServiceLikeType", [], function(
        foo
    ) {
        return foo + "bar";
    });

    it("Custom servicelike type", () => {
        expect(myChevron.get("myServiceLikeModule")("foo")).toBe("foobar");
    });
});
