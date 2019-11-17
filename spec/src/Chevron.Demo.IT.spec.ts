import { Chevron } from "../../src/Chevron";
import { Autowired } from "../../src/decorators/Autowired";
import { Injectable } from "../../src/decorators/Injectable";
import { DefaultBootstrappings } from "../../src/bootstrap/DefaultBootstrappings";

describe("Chevron Demo ITs", () => {
    it("Usage#1", () => {
        const logSpy = spyOn(console, "log");

        const cv = new Chevron(); // Create a new instance which acts as the container for the injectables

        /*
         * Classic API.
         */

        class MyFactory {
            public sayHello(): void {
                console.log("Hello!");
            }
        }

        cv.registerInjectable(MyFactory, DefaultBootstrappings.CLASS, []);

        cv.getInjectableInstance(MyFactory).sayHello(); // Prints "Hello!"

        expect(logSpy).toHaveBeenCalledWith("Hello!");
    });

    it("Usage#2", () => {
        const logSpy = spyOn(console, "log");

        const cv = new Chevron();

        /*
         * Decorator API.
         */

        @Injectable(cv, DefaultBootstrappings.CLASS, [])
        class MyFactory {
            public sayHello(): void {
                console.log("Hello!");
            }
        }

        class ConsumerClass {
            @Autowired(cv, MyFactory)
            private readonly injectedMyFactory: any;

            public run(): void {
                this.injectedMyFactory.sayHello();
            }
        }

        new ConsumerClass().run(); // Prints "Hello!"

        expect(logSpy).toHaveBeenCalledWith("Hello!");
    });

    it("Dependencies#1", () => {
        const logSpy = spyOn(console, "log");

        const cv = new Chevron(); // Create a new instance which acts as the container for the injectables

        class MyFactory {
            public sayHello(): void {
                console.log("Hello!");
            }
        }

        cv.registerInjectable(MyFactory, DefaultBootstrappings.CLASS, []);

        const myService: (myFactory: MyFactory) => void = (
            myFactory: MyFactory
        ) => {
            // Dependency will be available in the service as an argument.
            myFactory.sayHello();
        };

        cv.registerInjectable(myService, DefaultBootstrappings.FUNCTION, [
            "MyFactory"
        ]);

        cv.getInjectableInstance(myService)(); // Prints "Hello!"

        expect(logSpy).toHaveBeenCalledWith("Hello!");
    });

    it("Keys#1", () => {
        const logSpy = spyOn(console, "log");

        const cv = new Chevron();

        class MyFactory {
            public sayHello(): void {
                console.log("Hello!");
            }
        }

        cv.registerInjectable(
            MyFactory,
            DefaultBootstrappings.CLASS,
            [],
            "myInjectableFactory1"
        );

        cv.registerInjectable(
            MyFactory,
            DefaultBootstrappings.CLASS,
            [],
            "myInjectableFactory2"
        );

        cv.getInjectableInstance("myInjectableFactory1").sayHello(); // Prints "Hello!"

        expect(logSpy).toHaveBeenCalledWith("Hello!");
    });
});
