/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { Chevron } from "../../../src/Chevron";
import { Injectable } from "../../../src/decorators/Injectable";
import { DefaultBootstrappings } from "../../../src/bootstrap/DefaultBootstrappings";

describe("Injectable", () => {
    it("registers", () => {
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

        expect(fooBarInstance.getFooBar()).toEqual("foobar");
    });
});
