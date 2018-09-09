import { Chevron } from "../src/chevron";

describe("Basic Service: ", () => {
    const myChevron = new Chevron();

    myChevron.set("myService1", "service", [], function(foo: any) {
        return foo + "bar";
    });

    it("Simple service", () => {
        expect(myChevron.get("myService1")("foo")).toBe("foobar");
    });

    myChevron.set("myService2", "service", ["myService1"], function(
        myService1: any,
        foo: any
    ) {
        return myService1(foo) + "Lorem";
    });

    it("Service with dependency", () => {
        expect(myChevron.get("myService2")("foo")).toBe("foobarLorem");
    });

    myChevron.set(
        "myService3",
        "service",
        ["myService1", "myService2"],
        function(myService1: any, myService2: any, foo: any) {
            return myService1(foo) + "ipsum" + myService2(foo);
        }
    );

    myChevron.set(
        "myService4",
        "service",
        ["myService3", "myService2"],
        function(myService3: any, myService2: any, foo: any) {
            return myService3(foo) + "et dolor" + myService2(foo);
        }
    );

    it("Service with multiple dependencies", () => {
        expect(myChevron.get("myService4")("foo")).toBe(
            "foobaripsumfoobarLoremet dolorfoobarLorem"
        );
    });
});
