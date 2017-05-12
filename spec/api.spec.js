"use strict";

const Chevron = require("../dist/chevron.common.js");
const myChev = new Chevron();

describe("API usage: ", function () {
    myChev.extend("myEmtpyType", function (module) {
        return module;
    });

    myChev.service("myEmtpyTypeModule", [], function () {
        return "foo";
    });

    it("Custom empty type", function () {
        expect(myChev.get("myEmtpyTypeModule")()).toBe("foo");
    });


    myChev.extend("myServiceLikeType", function (moduleContent, dependencies) {
        const serviceFn = moduleContent;

        moduleContent = function () {
            //Chevron service function wrapper
            //Return function with args injected
            return serviceFn(...dependencies, ...arguments);
        };

        return moduleContent;
    });

    myChev.service("myServiceLikeModule", [], function (foo) {
        return foo + "bar";
    });

    it("Custom servicelike type", function () {
        expect(myChev.get("myServiceLikeModule")("foo")).toBe("foobar");
    });
});
