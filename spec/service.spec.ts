import { Chevron } from "src/Chevron";

describe("Basic Service: ", () => {
    const myChevron = new Chevron();

    myChevron.set("myService1", "service", [], (foo: any) => foo + "bar");

    it("Simple service", () => {
        expect(myChevron.get("myService1")("foo")).toBe("foobar");
    });

    myChevron.set(
        "myService2",
        "service",
        ["myService1"],
        (myService1: any, foo: any) => myService1(foo) + "Lorem"
    );

    it("Service with dependency", () => {
        expect(myChevron.get("myService2")("foo")).toBe("foobarLorem");
    });

    myChevron.set(
        "myService3",
        "service",
        ["myService1", "myService2"],
        (myService1: any, myService2: any, foo: any) =>
            myService1(foo) + "ipsum" + myService2(foo)
    );

    myChevron.set(
        "myService4",
        "service",
        ["myService3", "myService2"],
        (myService3: any, myService2: any, foo: any) =>
            myService3(foo) + "et dolor" + myService2(foo)
    );

    it("Service with multiple dependencies", () => {
        expect(myChevron.get("myService4")("foo")).toBe(
            "foobaripsumfoobarLoremet dolorfoobarLorem"
        );
    });
});
