import { Chevron } from "../../src/Chevron";
import { Injectable } from "../../src/decorators/Injectable";
import { InjectableType } from "../../src/injectableTypes/InjectableType";

describe("Injectable tests", () => {
    it("Asserts that @Injectable works", () => {
        const cv = new Chevron();
        const result = 123;

        const testFactoryName = "testFactoryName";

        @Injectable(cv, testFactoryName, InjectableType.FACTORY, [])
        class TestFactoryClass {
            public getVal() {
                return result;
            }
        }

        expect(cv.get(testFactoryName).getVal()).toBe(result);
    });
});
