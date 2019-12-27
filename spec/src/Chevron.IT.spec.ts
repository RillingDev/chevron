/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { Chevron, DefaultBootstrappings } from "../../src/main";

describe("Chevron", () => {
    describe("constructor", () => {
        it("creates instance", () => {
            const chevron = new Chevron();

            expect(chevron).toBeInstanceOf(Chevron);
        });
    });

    describe("registerInjectable", () => {
        it("registers injectables", () => {
            const chevron = new Chevron();

            const myFunction = () => {
                console.log("Hello world!");
            };
            chevron.registerInjectable(myFunction);

            expect(chevron.hasInjectable(myFunction)).toBeTrue();
        });

        it("throws for no guessable name", () => {
            const chevron = new Chevron();
            expect(() => chevron.registerInjectable(1)).toThrowError(
                "Could not guess name of '1', please explicitly define one."
            );
        });

        it("throws for duplicate name", () => {
            const chevron = new Chevron();

            chevron.registerInjectable(() => 1, { name: "foo" });

            expect(() =>
                chevron.registerInjectable(() => 1, { name: "foo" })
            ).toThrowError("Name already exists: 'foo'.");
        });
    });

    describe("getInjectableInstance", () => {
        it("retrieves injectables", () => {
            const chevron = new Chevron();

            const myFunction = () => {
                console.log("Hello world!");
            };
            chevron.registerInjectable(myFunction);

            const myFunctionInstance = chevron.getInjectableInstance(
                myFunction
            );

            expect(myFunctionInstance).toBe(myFunction);
        });

        it("throws for no injectable with name", () => {
            const chevron = new Chevron();

            expect(() => chevron.getInjectableInstance("foo")).toThrowError(
                "Injectable 'foo' does not exist."
            );
        });

        it("bootstraps", () => {
            const chevron = new Chevron();

            class MyClass {}

            chevron.registerInjectable(MyClass, {
                bootstrapping: DefaultBootstrappings.CLASS
            });

            const injectableInstance = chevron.getInjectableInstance(MyClass);

            expect(injectableInstance).toBeInstanceOf(MyClass);
        });

        it("bootstraps with context", () => {
            const chevron = new Chevron();

            class Foo {}
            chevron.registerInjectable(Foo, {
                bootstrapping: DefaultBootstrappings.CLASS
            });

            type Context = number;

            class MyClass {
                public constructor(
                    ignored: Foo,
                    public readonly context: Context
                ) {}
            }

            chevron.registerInjectable(MyClass, {
                bootstrapping: DefaultBootstrappings.CLASS,
                dependencies: [Foo]
            });

            const injectableInstance = chevron.getInjectableInstance(
                MyClass,
                123
            );

            expect(injectableInstance.context).toBe(123);
        });

        it("recursively resolves dependencies", () => {
            const chevron = new Chevron();

            class SeedData {
                public getSeedValue() {
                    return 123;
                }
            }

            chevron.registerInjectable(SeedData, {
                bootstrapping: DefaultBootstrappings.CLASS
            });

            class SeedController {
                public constructor(private readonly seed: SeedData) {}

                public getPrintableSeed() {
                    return String(this.seed.getSeedValue());
                }
            }

            chevron.registerInjectable(SeedController, {
                dependencies: [SeedData],
                bootstrapping: DefaultBootstrappings.CLASS
            });

            class AppController {
                public constructor(
                    private readonly seedController: SeedController
                ) {}

                public getFormattedSeed() {
                    return `Seed: '${this.seedController.getPrintableSeed()}'.`;
                }
            }

            chevron.registerInjectable(AppController, {
                dependencies: [SeedController],
                bootstrapping: DefaultBootstrappings.CLASS
            });

            const appControllerInstance: AppController = chevron.getInjectableInstance(
                AppController
            );

            expect(appControllerInstance.getFormattedSeed()).toBe(
                "Seed: '123'."
            );
        });

        it("throws for circular dependencies", () => {
            const chevron = new Chevron();

            class SeedData {}

            chevron.registerInjectable(SeedData, {
                bootstrapping: DefaultBootstrappings.CLASS,
                dependencies: ["SeedController"]
            });

            class SeedController {
                public constructor(private readonly seed: SeedData) {}
            }

            chevron.registerInjectable(SeedController, {
                dependencies: [SeedData],
                bootstrapping: DefaultBootstrappings.CLASS
            });

            class AppController {}

            chevron.registerInjectable(AppController, {
                dependencies: [SeedController],
                bootstrapping: DefaultBootstrappings.CLASS
            });

            expect(() =>
                chevron.getInjectableInstance(AppController)
            ).toThrowError(
                "Circular dependencies found: 'AppController' -> 'SeedController' -> 'SeedData' -> 'SeedController'."
            );
        });
    });

    describe("hasInjectable", () => {
        it("returns true if an injectable with that name is registered", () => {
            const chevron = new Chevron();

            const myFunction = () => {
                console.log("Hello world!");
            };
            chevron.registerInjectable(myFunction);

            expect(chevron.hasInjectable(myFunction)).toBeTrue();
        });

        it("returns false if no injectable with that name is registered", () => {
            const chevron = new Chevron();

            const myFunction = () => {
                console.log("Hello world!");
            };

            expect(chevron.hasInjectable(myFunction)).toBeFalse();
        });
    });

    describe("hasInjectableInstance", () => {
        it("returns false if no injectable with that name is registered", () => {
            const chevron = new Chevron();

            const myFunction = () => {
                console.log("Hello world!");
            };

            expect(chevron.hasInjectableInstance(myFunction)).toBeFalse();
        });

        it("returns false if no instance for this injectable exists", () => {
            const chevron = new Chevron();

            const myFunction = () => {
                console.log("Hello world!");
            };
            chevron.registerInjectable(myFunction);

            expect(chevron.hasInjectableInstance(myFunction)).toBeFalse();
        });

        it("returns true if an instance for this injectable exists", () => {
            const chevron = new Chevron();

            const myFunction = () => {
                console.log("Hello world!");
            };
            chevron.registerInjectable(myFunction);
            chevron.getInjectableInstance(myFunction);

            expect(chevron.hasInjectableInstance(myFunction)).toBeTrue();
        });

        it("returns false if no instance in this scope for this injectable exists", () => {
            const chevron = new Chevron();

            const myFunction = () => {
                console.log("Hello world!");
            };
            chevron.registerInjectable(myFunction, {
                scope: () => Math.random().toString()
            });
            chevron.getInjectableInstance(myFunction);

            expect(chevron.hasInjectableInstance(myFunction)).toBeFalse();
        });
    });
});
