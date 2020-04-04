import { Chevron } from "../../../src/Chevron";
import { Injectable } from "../../../src/decorators/Injectable";

describe("Injectable", () => {
    it("registers injectables", () => {
        const chevron = new Chevron<null>();

        @Injectable<Foo>(chevron)
        class Foo {}

        expect(chevron.hasInjectable(Foo)).toBeTrue();
    });

    it("supports multiple dependency types", () => {
        const chevron = new Chevron<null>();

        @Injectable<Foo>(chevron)
        class Foo {
            public getFoo(): string {
                return "foo";
            }
        }

        @Injectable<Bar>(chevron)
        class Bar {
            public getBar(): string {
                return "bar";
            }
        }

        @Injectable<FooBar>(chevron, {
            dependencies: [Foo, Bar],
        })
        class FooBar {
            public constructor(
                private readonly foo: Foo,
                private readonly bar: Bar
            ) {}

            public getFooBar(): string {
                return this.foo.getFoo() + this.bar.getBar();
            }
        }

        const fooBarInstance = chevron.getInjectableInstance<FooBar>(FooBar);

        expect(fooBarInstance.getFooBar()).toEqual("foobar");
    });
});
