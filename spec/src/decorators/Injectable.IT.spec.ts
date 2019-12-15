/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { Chevron } from "../../../src/Chevron";
import { Injectable } from "../../../src/decorators/Injectable";
import { DefaultBootstrappings } from "../../../src/bootstrap/DefaultBootstrappings";

describe("Injectable", () => {
    it("registers injectables", () => {
        const chevron = new Chevron();

        @Injectable(chevron, { bootstrapping: DefaultBootstrappings.CLASS })
        class Foo {}

        expect(chevron.hasInjectable(Foo)).toBeTrue();
    });
});
