import {
    Chevron,
    DefaultFactory,
    DefaultScope,
    Injectable
} from "../../src/main";
import { InjectableClassInitializer } from "../../src/factory/InjectableClassInitializer";

describe("Chevron Demo", () => {
    describe("basic", () => {
        it("registers/retrieves injectables", () => {
            // Create a new chevron instance.
            const chevron = new Chevron<null>();

            type LoggingNoop = () => void;

            const myFunction: LoggingNoop = () => {
                console.log("Hello world!");
            };

            // Register the myFunction variable as a plain injectable.
            chevron.registerInjectable<LoggingNoop, LoggingNoop>(myFunction);

            // Retrieve injectable (could also be done using `chevron.getInjectableInstance("myFunction")`.
            const myFunctionInstance = chevron.getInjectableInstance<
                LoggingNoop
            >(myFunction);

            expect(myFunctionInstance).toBe(myFunction);
        });

        it("supports custom names", () => {
            const chevron = new Chevron<null>();

            type LoggingNoop = () => void;

            const myFunction: LoggingNoop = () => {
                console.log("Hello world!");
            };
            chevron.registerInjectable<LoggingNoop, LoggingNoop>(myFunction, {
                // A custom name can either be a string or another nameable value like a function.
                name: "myCoolName"
            });

            const myFunctionInstance = chevron.getInjectableInstance<
                LoggingNoop
            >("myCoolName");

            expect(myFunctionInstance).toBe(myFunction);
        });
    });
    describe("factories", () => {
        it("supports factory: class", () => {
            const chevron = new Chevron<null>();

            class MyClass {
                private readonly modifier: number;

                public constructor() {
                    this.modifier = 2;
                }

                public getDouble(n: number): number {
                    return n * this.modifier;
                }
            }

            chevron.registerInjectable<
                MyClass,
                InjectableClassInitializer<MyClass, void>
            >(MyClass, {
                // Use the "CLASS" factory to instantiate the value as class
                factory: DefaultFactory.CLASS()
            });

            const myClassInstance = chevron.getInjectableInstance<MyClass>(
                MyClass
            );

            expect(myClassInstance).toBeInstanceOf(MyClass);
        });

        it("supports factory: function", () => {
            const chevron = new Chevron<null>();

            type MathUnaryOperation = (val: number) => number;
            const multiply: MathUnaryOperation = (val: number) => val * 2;

            const myFunction: () => MathUnaryOperation = () => multiply;
            chevron.registerInjectable<
                MathUnaryOperation,
                () => MathUnaryOperation
            >(myFunction, {
                // Use the "FUNCTION" factory to instantiate the value as a function
                factory: DefaultFactory.FUNCTION()
            });

            const myFunctionInstance = chevron.getInjectableInstance<
                MathUnaryOperation
            >(myFunction);

            expect(myFunctionInstance).toEqual(multiply);
        });

        it("supports factory: custom", () => {
            const chevron = new Chevron<null>();

            const myInjectable = 16;
            chevron.registerInjectable<number, number>(myInjectable, {
                factory: (val: number) => val * 2,
                name: "val"
            });

            const myFunctionInstance = chevron.getInjectableInstance<number>(
                "val"
            );

            expect(myFunctionInstance).toEqual(32);
        });
    });
    describe("dependencies", () => {
        it("supports dependencies", () => {
            const chevron = new Chevron<null>();

            type MathFn = (a: number) => number;
            const doublingFn: MathFn = (a: number) => a * 2;

            chevron.registerInjectable<MathFn, MathFn>(doublingFn);

            class MyClass {
                public constructor(private readonly doublingFnAsDep: MathFn) {}

                public getDouble(n: number): number {
                    return this.doublingFnAsDep(n);
                }
            }

            /*
             * Register injectable with dependency - we could also use `["doublingFn"]`.
             * We want MyClass to be instantiated by constructing it through the CLASS factory,
             * where we will have the dependencies as constructor parameters.
             */
            chevron.registerInjectable<
                MyClass,
                InjectableClassInitializer<MyClass>
            >(MyClass, {
                dependencies: [doublingFn],
                factory: DefaultFactory.CLASS()
            });

            // When retrieving, all dependencies will be resolved first.
            const myClassInstance = chevron.getInjectableInstance<MyClass>(
                MyClass
            );

            expect(myClassInstance).toBeInstanceOf(MyClass);
            expect(myClassInstance.getDouble(2)).toBe(4);
        });
    });
    describe("scopes", () => {
        it("supports scopes: prototype", () => {
            const chevron = new Chevron<null>();

            class MyClass {}

            chevron.registerInjectable<
                MyClass,
                InjectableClassInitializer<MyClass, void>
            >(MyClass, {
                factory: DefaultFactory.CLASS(),
                scope: DefaultScope.PROTOTYPE()
            });

            const myClassInstance1 = chevron.getInjectableInstance<MyClass>(
                MyClass
            );
            const myClassInstance2 = chevron.getInjectableInstance<MyClass>(
                MyClass
            );

            expect(myClassInstance1).not.toBe(myClassInstance2);
        });

        it("supports scopes: custom", () => {
            interface SessionContext {
                sessionId: string;
            }

            const chevron = new Chevron<SessionContext>();

            class MySession {}

            chevron.registerInjectable<
                MySession,
                InjectableClassInitializer<MySession, void>
            >(MySession, {
                factory: DefaultFactory.CLASS(),
                // Define a custom scope to create scopes based on the property `sessionId` of the context.
                scope: (context: SessionContext | null) => {
                    if (context == null) {
                        return "DEFAULT";
                    }
                    return context.sessionId;
                }
            });

            // Injectable retrieval can pass optional context data to influence scoping.
            const mySessionInstanceFoo = chevron.getInjectableInstance<
                MySession
            >(MySession, {
                sessionId: "123"
            });
            const mySessionInstanceBar = chevron.getInjectableInstance<
                MySession
            >(MySession, {
                sessionId: "987"
            });
            const mySessionInstanceBarAgain = chevron.getInjectableInstance<
                MySession
            >(MySession, { sessionId: "987" });

            expect(mySessionInstanceFoo).toBeInstanceOf(MySession);
            expect(mySessionInstanceBar).toBeInstanceOf(MySession);
            expect(mySessionInstanceFoo).not.toBe(mySessionInstanceBar);
            expect(mySessionInstanceBar).toBe(mySessionInstanceBarAgain);
        });
    });

    describe("decorators", () => {
        it("supports decorators", () => {
            const chevron = new Chevron<null>();

            // Same as chevron.registerInjectable(Foo, { factory: DefaultFactory.CLASS() });
            @Injectable<Foo>(chevron)
            class Foo {
                public getFoo(): string {
                    return "foo";
                }
            }

            @Injectable<FooBar>(chevron, {
                dependencies: [Foo]
            })
            class FooBar {
                public constructor(private readonly foo: Foo) {}

                public getFooBar(): string {
                    return this.foo.getFoo() + "bar";
                }
            }

            const fooBarInstance = chevron.getInjectableInstance<FooBar>(
                FooBar
            );

            expect(fooBarInstance.getFooBar()).toEqual("foobar");
        });
    });
});
