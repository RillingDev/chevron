const Chevron = require("../dist/chevron.common.js");
const myChevron = new Chevron();

describe("Basic Factory: ", () => {
    myChevron.set("myFactory1", "factory", [], function() {
        const _this = this;

        _this.foo = "foo";
    });

    it("Simple factory", () => {
        expect(myChevron.get("myFactory1").foo).toBe("foo");
    });

    myChevron.set("myFactory2", "factory", ["myFactory1"], function(
        myFactory1
    ) {
        const _this = this;

        _this.foo = myFactory1.foo;
        _this.bar = "bar";
    });

    myChevron.set(
        "myFactory3",
        "factory",
        ["myFactory2", "myFactory1"],
        function(myFactory2, myFactory1) {
            const _this = this;

            _this.foofoo = myFactory2.foo + myFactory1.foo;
            _this.bar = myFactory2.bar;
            _this.foobar = myFactory1.foo + myFactory2.bar;
        }
    );

    it("Factory with dependencies", () => {
        expect(myChevron.get("myFactory3").foobar).toBe("foobar");
    });
});
