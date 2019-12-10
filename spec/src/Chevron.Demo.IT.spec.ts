/* eslint-disable @typescript-eslint/explicit-function-return-type */
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

    it("supports different bootstrappings", () => {
        const chevron = new Chevron();

        const MyClass = class {
            private readonly modifier: number;

            public constructor() {
                this.modifier = 2;
            }

            public getDouble(n: number) {
                return n * this.modifier;
            }
        };
        chevron.registerInjectable(MyClass, {
            // Use the "CLASS" Bootstrapping to instantiate the value as class
            bootstrapping: DefaultBootstrappings.CLASS
        });

        const myFunctionInstance = chevron.getInjectableInstance(MyClass);

        expect(myFunctionInstance).toBeInstanceOf(MyClass);
    });

    it("supports custom names", () => {
        const chevron = new Chevron();

        const myFunction = () => {
            console.log("Hello world!");
        };
        chevron.registerInjectable(myFunction, {
            // A custom name can either be a string or another nameable value like a function.
            name: "myCoolName"
        });

        const myFunctionInstance = chevron.getInjectableInstance("myCoolName");

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

        /*
         * Register injectable with dependency - we could also use `["doublingFn"]`.
         * We want MyClass to be instantiated by constructing it through the CLASS bootstrapping,
         * where we will have the dependencies as constructor parameters.
         */
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

        chevron.registerInjectable(MySession, {
            bootstrapping: DefaultBootstrappings.CLASS,
            // Define a custom scope to create scopes based on the property `sessionId` of the context.
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

        // Same as chevron.registerInjectable(Foo, { bootstrapping: DefaultBootstrappings.CLASS });
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
            public constructor(private readonly foo: Foo) {}

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
