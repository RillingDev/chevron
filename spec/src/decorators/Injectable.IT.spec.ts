import { Chevron } from "../../../src/Chevron";
import { Injectable } from "../../../src/decorators/Injectable";

describe("Injectable", () => {
    it("registers injectables", () => {
        const chevron = new Chevron<null>();

        @Injectable(chevron)
        class Foo {}

        expect(chevron.hasInjectable(Foo)).toBeTrue();
    });
});
