/* tslint:disable:max-classes-per-file */
import { Chevron } from "../../src/Chevron";
import { InjectableType } from "../../src/injectableTypes/InjectableType";
import { Autowired } from "../../src/decorators/Autowired";
import { Injectable } from "../../src/decorators/Injectable";

describe("Chevron Demo ITs", () => {

    it("Usage#1", () => {
        const logSpy = spyOn(console, "log");

        const cv = new Chevron(); // Create a new instance which acts as the container for the injectables

        /*
         * Classic API.
         */

        class MyFactory {
            public sayHello() {
                console.log("Hello!");
            }
        }

        cv.set(
            InjectableType.FACTORY, // Type of the injectable.
            [], // Dependencies this injectable uses, none in this case.
            MyFactory // Content of the injectable. In this case, it will also be used as the key for accessing the injectable later.
        );

        cv.get(MyFactory).sayHello(); // Prints "Hello!"

        expect(logSpy).toHaveBeenCalledWith("Hello!");
    });

    it("Usage#2", () => {
        const logSpy = spyOn(console, "log");

        const cv = new Chevron();

        /*
         * Decorator API.
         */

        @Injectable(cv, InjectableType.FACTORY, [])
        class MyFactory {
            public sayHello() {
                console.log("Hello!");
            }
        }

        class ConsumerClass {
            @Autowired(cv, MyFactory)
            private readonly injectedMyFactory: any;

            public run() {
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
            public sayHello() {
                console.log("Hello!");
            }
        }

        cv.set(
            InjectableType.FACTORY,
            [],
            MyFactory
        );

        function myService(myFactory: MyFactory) { // Dependency will be available in the service as an argument.
            myFactory.sayHello();
        }

        cv.set(
            InjectableType.SERVICE,
            [MyFactory], // Key of the dependency is listed here.
            myService
        );

        cv.get(myService)(); // Prints "Hello!"

        expect(logSpy).toHaveBeenCalledWith("Hello!");
    });

    it("Keys#1", () => {
        const logSpy = spyOn(console, "log");

        const cv = new Chevron();

        class MyFactory {
            public sayHello() {
                console.log("Hello!");
            }
        }

        cv.set(
            InjectableType.FACTORY,
            [],
            MyFactory,
            "myInjectableFactory1"
        );

        cv.set(
            InjectableType.FACTORY,
            [],
            MyFactory,
            "myInjectableFactory2"
        );

        cv.get("myInjectableFactory1").sayHello(); // Prints "Hello!"

        expect(logSpy).toHaveBeenCalledWith("Hello!");
    });
});
