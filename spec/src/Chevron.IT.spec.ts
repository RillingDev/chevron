import {
    Chevron,
    DefaultBootstrappings,
    InjectableClassInitializer
} from "../../src/main";

describe("Chevron", () => {
    describe("constructor", () => {
        it("creates instance", () => {
            const chevron = new Chevron<null>();

            expect(chevron).toBeInstanceOf(Chevron);
        });
    });

    describe("registerInjectable", () => {
        it("registers injectables", () => {
            const chevron = new Chevron<null>();
            type LoggingNoop = () => void;

            const myFunction: LoggingNoop = () => {
                console.log("Hello world!");
            };
            chevron.registerInjectable<LoggingNoop, LoggingNoop>(myFunction);

            expect(chevron.hasInjectable(myFunction)).toBeTrue();
        });

        it("throws for no guessable name", () => {
            const chevron = new Chevron<null>();
            expect(() =>
                chevron.registerInjectable<number, number>(1)
            ).toThrowError(
                "Could not guess name of '1', please explicitly define one."
            );
        });

        it("throws for duplicate name", () => {
            const chevron = new Chevron<null>();

            type NumberProvider = () => number;

            chevron.registerInjectable<number, NumberProvider>(() => 1, {
                name: "foo"
            });

            expect(() =>
                chevron.registerInjectable<NumberProvider, NumberProvider>(
                    () => 1,
                    { name: "foo" }
                )
            ).toThrowError("Name already exists: 'foo'.");
        });
    });

    describe("getInjectableInstance", () => {
        it("retrieves injectables", () => {
            const chevron = new Chevron<null>();
            type LoggingNoop = () => void;

            const myFunction: LoggingNoop = () => {
                console.log("Hello world!");
            };
            chevron.registerInjectable<LoggingNoop, LoggingNoop>(myFunction);

            const myFunctionInstance = chevron.getInjectableInstance<
                LoggingNoop
            >(myFunction);

            expect(myFunctionInstance).toBe(myFunction);
        });

        it("throws for no injectable with name", () => {
            const chevron = new Chevron<null>();

            expect(() =>
                chevron.getInjectableInstance<string>("foo")
            ).toThrowError("Injectable 'foo' does not exist.");
        });

        it("bootstraps", () => {
            const chevron = new Chevron<null>();

            class MyClass {}

            chevron.registerInjectable<
                MyClass,
                InjectableClassInitializer<MyClass, void>
            >(MyClass, {
                bootstrapping: DefaultBootstrappings.CLASS()
            });

            const injectableInstance = chevron.getInjectableInstance<MyClass>(
                MyClass
            );

            expect(injectableInstance).toBeInstanceOf(MyClass);
        });

        it("bootstraps with context", () => {
            type Context = number;
            const chevron = new Chevron<Context>();

            class MyClass {
                public constructor(public readonly context: Context) {}
            }

            chevron.registerInjectable<
                MyClass,
                InjectableClassInitializer<MyClass, Context>
            >(MyClass, {
                bootstrapping: (initializer, dependencies, context) =>
                    Reflect.construct(initializer, [context])
            });

            const injectableInstance = chevron.getInjectableInstance<MyClass>(
                MyClass,
                123
            );

            expect(injectableInstance.context).toBe(123);
        });

        it("recursively resolves dependencies", () => {
            const chevron = new Chevron<null>();

            class SeedData {
                public getSeedValue(): number {
                    return 123;
                }
            }

            chevron.registerInjectable<
                SeedData,
                InjectableClassInitializer<SeedData, void>
            >(SeedData, {
                bootstrapping: DefaultBootstrappings.CLASS()
            });

            class SeedController {
                public constructor(private readonly seed: SeedData) {}

                public getPrintableSeed(): string {
                    return String(this.seed.getSeedValue());
                }
            }

            chevron.registerInjectable<
                SeedController,
                InjectableClassInitializer<SeedController, SeedData>,
                SeedData
            >(SeedController, {
                dependencies: [SeedData],
                bootstrapping: DefaultBootstrappings.CLASS()
            });

            class AppController {
                public constructor(
                    private readonly seedController: SeedController
                ) {}

                public getFormattedSeed(): string {
                    return `Seed: '${this.seedController.getPrintableSeed()}'.`;
                }
            }

            chevron.registerInjectable<
                AppController,
                InjectableClassInitializer<AppController, SeedController>
            >(AppController, {
                dependencies: [SeedController],
                bootstrapping: DefaultBootstrappings.CLASS()
            });

            const appControllerInstance = chevron.getInjectableInstance<
                AppController
            >(AppController);

            expect(appControllerInstance.getFormattedSeed()).toBe(
                "Seed: '123'."
            );
        });

        it("throws for circular dependencies", () => {
            const chevron = new Chevron<null>();

            class SeedData {}

            chevron.registerInjectable<
                SeedData,
                InjectableClassInitializer<SeedData, void>
            >(SeedData, {
                bootstrapping: DefaultBootstrappings.CLASS(),
                dependencies: ["SeedController"]
            });

            class SeedController {
                public constructor(private readonly seed: SeedData) {}
            }

            chevron.registerInjectable<
                SeedController,
                InjectableClassInitializer<SeedController, SeedData>
            >(SeedController, {
                dependencies: [SeedData],
                bootstrapping: DefaultBootstrappings.CLASS()
            });

            class AppController {}

            chevron.registerInjectable<
                AppController,
                InjectableClassInitializer<AppController, SeedController>
            >(AppController, {
                dependencies: [SeedController],
                bootstrapping: DefaultBootstrappings.CLASS()
            });

            expect(() =>
                chevron.getInjectableInstance<AppController>(AppController)
            ).toThrowError(
                "Circular dependencies found: 'AppController' -> 'SeedController' -> 'SeedData' -> 'SeedController'."
            );
        });
    });

    describe("hasInjectable", () => {
        it("returns true if an injectable with that name is registered", () => {
            const chevron = new Chevron<null>();
            type LoggingNoop = () => void;

            const myFunction: LoggingNoop = () => {
                console.log("Hello world!");
            };
            chevron.registerInjectable<LoggingNoop, LoggingNoop>(myFunction);

            expect(chevron.hasInjectable(myFunction)).toBeTrue();
        });

        it("returns false if no injectable with that name is registered", () => {
            const chevron = new Chevron<null>();

            expect(chevron.hasInjectable("myFunction")).toBeFalse();
        });
    });

    describe("hasInjectableInstance", () => {
        it("returns false if no injectable with that name is registered", () => {
            const chevron = new Chevron<null>();

            expect(chevron.hasInjectableInstance("myFunction")).toBeFalse();
        });

        it("returns false if no instance for this injectable exists", () => {
            const chevron = new Chevron<null>();
            type LoggingNoop = () => void;

            const myFunction: LoggingNoop = () => {
                console.log("Hello world!");
            };
            chevron.registerInjectable<LoggingNoop, LoggingNoop>(myFunction);

            expect(chevron.hasInjectableInstance(myFunction)).toBeFalse();
        });

        it("returns true if an instance for this injectable exists", () => {
            const chevron = new Chevron<null>();
            type LoggingNoop = () => void;

            const myFunction: LoggingNoop = () => {
                console.log("Hello world!");
            };
            chevron.registerInjectable<LoggingNoop, LoggingNoop>(myFunction);
            chevron.getInjectableInstance<LoggingNoop>(myFunction);

            expect(chevron.hasInjectableInstance(myFunction)).toBeTrue();
        });

        it("returns false if no instance in this scope for this injectable exists", () => {
            const chevron = new Chevron<string>();
            type LoggingNoop = () => void;

            const myFunction: LoggingNoop = () => {
                console.log("Hello world!");
            };
            chevron.registerInjectable<LoggingNoop, LoggingNoop>(myFunction, {
                scope: id => id
            });
            chevron.getInjectableInstance<LoggingNoop>(
                myFunction,
                "SOME_SCOPE"
            );

            expect(
                chevron.hasInjectableInstance(myFunction, "OTHER_SCOPE")
            ).toBeFalse();
        });
    });
});
