/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { Chevron } from "../../src/main";

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

            expect(chevron.hasInjectable("myFunction")).toBeTrue();
            expect(chevron.hasInjectable(myFunction)).toBeTrue();
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
    });
});
