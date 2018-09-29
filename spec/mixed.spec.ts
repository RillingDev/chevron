import { Chevron } from "src/Chevron";

describe("Mixed types: ", () => {
    const myChevron = new Chevron();

    myChevron.set("myService1", "service", [], (foo: any) => foo * 2);

    myChevron.set("myFactory1", "factory", ["myService1"], function(
        this: any,
        myService1: any
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
        (myFactory1: any, myService1: any) => myService1(myFactory1.bar)
    );

    myChevron.set(
        "myFactory2",
        "factory",
        ["myService2", "myFactory1", "myService1"],
        function(this: any, myService2: any, myFactory1: any, myService1: any) {
            const _this = this;

            _this.foo = myService2() + myService1(myFactory1.bar);
        }
    );

    it("Complex mixed types", () => {
        expect(myChevron.get("myFactory2").foo).toBe(168);
    });
});
