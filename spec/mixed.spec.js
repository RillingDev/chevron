const Chevron = require("../dist/chevron.common.js");
const myChevron = new Chevron();

describe("Mixed types: ", () => {
    myChevron.set("myService1", "service", [], function(foo) {
        return foo * 2;
    });

    myChevron.set("myFactory1", "factory", ["myService1"], function(
        myService1
    ) {
        const _this = this;

        _this.bar = myService1(21);
    });

    it("Simple mixed types", () => {
        expect(myChevron.get("myFactory1").bar).toBe(42);
    });

    myChevron.set(
        "myService2",
        "service",
        ["myFactory1", "myService1"],
        function(myFactory1, myService1) {
            return myService1(myFactory1.bar);
        }
    );

    myChevron.set(
        "myFactory2",
        "factory",
        ["myService2", "myFactory1", "myService1"],
        function(myService2, myFactory1, myService1) {
            const _this = this;

            _this.foo = myService2() + myService1(myFactory1.bar);
        }
    );

    it("Complex mixed types", () => {
        expect(myChevron.get("myFactory2").foo).toBe(168);
    });
});
