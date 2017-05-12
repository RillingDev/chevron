"use strict";

const Chevron = require("../dist/chevron.common.js");
const myChev = new Chevron();

describe("Basic Factory: ", function () {
    myChev.factory("myFactory1", [], function () {
        const _this = this;

        _this.foo = "foo";
    });

    it("Simple factory", function () {
        expect(myChev.get("myFactory1").foo).toBe("foo");
    });


    myChev.factory("myFactory2", ["myFactory1"], function (myFactory1) {
        const _this = this;

        _this.foo = myFactory1.foo;
        _this.bar = "bar";
    });

    myChev.factory("myFactory3", ["myFactory2", "myFactory1"], function (myFactory2, myFactory1) {
        const _this = this;

        _this.foofoo = myFactory2.foo + myFactory1.foo;
        _this.bar = myFactory2.bar;
        _this.foobar = myFactory1.foo + myFactory2.bar;
    });

    it("Factory with dependencies", function () {
        expect(myChev.get("myFactory3").foobar).toBe("foobar");
    });
});
