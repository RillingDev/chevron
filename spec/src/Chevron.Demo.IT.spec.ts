import { Chevron, DefaultBootstrappings, Injectable } from "../../src/main";

describe("Chevron Demo ITs", () => {
    it("creates instance", () => {
        // Create a new instance
        const chevron = new Chevron();

        expect(chevron).toBeInstanceOf(Chevron);
    });

    it("registers injectables", () => {
        const chevron = new Chevron();

        const myFunction = () => {
            console.log("Hello world!");
        };
        // Register the myFunction variable as a plain injectable.
        chevron.registerInjectable(myFunction);

        expect(chevron.hasInjectable("myFunction")).toBeTrue();
        expect(chevron.hasInjectable(myFunction)).toBeTrue();
    });

    it("retrieves injectables", () => {
        const chevron = new Chevron();

        const myFunction = () => {
            console.log("Hello world!");
        };
        chevron.registerInjectable(myFunction);

        // Retrieve injectable (could also be done using `chevron.getInjectableInstance("myFunction")`.
        const myFunctionInstance = chevron.getInjectableInstance(myFunction);

        expect(myFunctionInstance).toBe(myFunction);
    });

    it("supports dependencies", () => {
        const chevron = new Chevron();

        type mathFnType = (a: number) => number;

        const doublingFn: mathFnType = (a: number) => a * 2;
        chevron.registerInjectable(doublingFn);

        const MyClass = class {
            public constructor(private readonly doublingFnAsDep: mathFnType) {}

            public getDouble(n: number) {
                return this.doublingFnAsDep(n);
            }
        };
        // Register injectable with dependency.
        // We could also use `["doublingFn"]`.
        // We want MyClass to be instantiated by constructing it through DefaultBootstrappings.CLASS.
        chevron.registerInjectable(MyClass, {
            dependencies: [doublingFn],
            bootstrapping: DefaultBootstrappings.CLASS
        });

        // When retrieving, all dependencies will be resolved first.
        const myClassInstance = chevron.getInjectableInstance(MyClass);

        expect(myClassInstance).toBeInstanceOf(MyClass);
        expect(myClassInstance.getDouble(2)).toBe(4);
    });

    it("supports scopes", () => {
        const chevron = new Chevron();

        interface SessionContext {
            sessionId: string;
        }

        const MySession = class {};

        // Define custom scope function to create scopes based on the property `sessionId` of the context.
        chevron.registerInjectable(MySession, {
            bootstrapping: DefaultBootstrappings.CLASS,
            scope: (context: SessionContext) => context.sessionId
        });

        // Injectable retrieval can pass optional context data to influence scoping.
        const mySessionInstanceFoo = chevron.getInjectableInstance(MySession, {
            sessionId: "123"
        });
        const mySessionInstanceBar = chevron.getInjectableInstance(MySession, {
            sessionId: "987"
        });
        const mySessionInstanceBarAgain = chevron.getInjectableInstance(
            MySession,
            { sessionId: "987" }
        );

        expect(mySessionInstanceFoo).toBeInstanceOf(MySession);
        expect(mySessionInstanceBar).toBeInstanceOf(MySession);
        expect(mySessionInstanceFoo).not.toBe(mySessionInstanceBar);
        expect(mySessionInstanceBar).toBe(mySessionInstanceBarAgain);
    });

    it("supports decorators", () => {
        const chevron = new Chevron();

        @Injectable(chevron, { bootstrapping: DefaultBootstrappings.CLASS })
        class Foo {
            public getFoo() {
                return "foo";
            }
        }

        @Injectable(chevron, {
            dependencies: [Foo],
            bootstrapping: DefaultBootstrappings.CLASS
        })
        class FooBar {
            constructor(private readonly foo: Foo) {}

            public getFooBar() {
                return this.foo.getFoo() + "bar";
            }
        }

        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(chevron.getInjectableInstance(FooBar).getFooBar()).toEqual(
            "foobar"
        );
    });
});
