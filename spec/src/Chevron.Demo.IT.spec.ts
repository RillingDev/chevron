/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
    Chevron,
    DefaultBootstrappings,
    DefaultScopes,
    Injectable
} from "../../src/main";

describe("Chevron Demo", () => {
    describe("basic", () => {
        it("registers/retrieves injectables", () => {
            // Create a new chevron instance.
            const chevron = new Chevron();

            const myFunction = () => {
                console.log("Hello world!");
            };

            // Register the myFunction variable as a plain injectable.
            chevron.registerInjectable(myFunction);

            // Retrieve injectable (could also be done using `chevron.getInjectableInstance("myFunction")`.
            const myFunctionInstance = chevron.getInjectableInstance(
                myFunction
            );

            expect(myFunctionInstance).toBe(myFunction);
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

            const myFunctionInstance = chevron.getInjectableInstance(
                "myCoolName"
            );

            expect(myFunctionInstance).toBe(myFunction);
        });
    });
    describe("bootstrapping", () => {
        it("supports bootstrappings: class", () => {
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

            const myClassInstance = chevron.getInjectableInstance(MyClass);

            expect(myClassInstance).toBeInstanceOf(MyClass);
        });

        it("supports bootstrappings: function", () => {
            const chevron = new Chevron();

            const multiply = (val: number) => val * 2;

            const myFunction = () => multiply;
            chevron.registerInjectable(myFunction, {
                // Use the "FUNCTION" Bootstrapping to instantiate the value as a function
                bootstrapping: DefaultBootstrappings.FUNCTION
            });

            const myFunctionInstance = chevron.getInjectableInstance(
                myFunction
            );

            expect(myFunctionInstance).toEqual(multiply);
        });

        it("supports bootstrappings: custom", () => {
            const chevron = new Chevron();

            const myInjectable = 16;
            chevron.registerInjectable(myInjectable, {
                bootstrapping: (val: number) => val * 2,
                name: "val"
            });

            const myFunctionInstance = chevron.getInjectableInstance("val");

            expect(myFunctionInstance).toEqual(32);
        });
    });
    describe("dependencies", () => {
        it("supports dependencies", () => {
            const chevron = new Chevron();

            type mathFnType = (a: number) => number;
            const doublingFn: mathFnType = (a: number) => a * 2;

            chevron.registerInjectable(doublingFn);

            const MyClass = class {
                public constructor(
                    private readonly doublingFnAsDep: mathFnType
                ) {}

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
    });
    describe("scopes", () => {
        it("supports scopes: prototype", () => {
            const chevron = new Chevron();

            const MyClass = class {};

            chevron.registerInjectable(MyClass, {
                bootstrapping: DefaultBootstrappings.CLASS,
                scope: DefaultScopes.PROTOTYPE
            });

            const myClassInstance1 = chevron.getInjectableInstance(MyClass);
            const myClassInstance2 = chevron.getInjectableInstance(MyClass);

            expect(myClassInstance1).not.toBe(myClassInstance2);
        });

        it("supports scopes: custom", () => {
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
            const mySessionInstanceFoo = chevron.getInjectableInstance(
                MySession,
                {
                    sessionId: "123"
                }
            );
            const mySessionInstanceBar = chevron.getInjectableInstance(
                MySession,
                {
                    sessionId: "987"
                }
            );
            const mySessionInstanceBarAgain = chevron.getInjectableInstance(
                MySession,
                { sessionId: "987" }
            );

            expect(mySessionInstanceFoo).toBeInstanceOf(MySession);
            expect(mySessionInstanceBar).toBeInstanceOf(MySession);
            expect(mySessionInstanceFoo).not.toBe(mySessionInstanceBar);
            expect(mySessionInstanceBar).toBe(mySessionInstanceBarAgain);
        });
    });

    describe("decorators", () => {
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

            const fooBarInstance = chevron.getInjectableInstance(FooBar);
            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(fooBarInstance.getFooBar()).toEqual("foobar");
        });
    });
});
