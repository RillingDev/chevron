import { Chevron } from "../../../src/Chevron";
import { Autowired } from "../../../src/decorators/Autowired";
import { Injectable } from "../../../src/decorators/Injectable";
import { InjectableType } from "../../../src/injectableTypes/InjectableType";

describe("Autowired tests", () => {
    it("Asserts that @Autowired works", () => {
        const cv = new Chevron();
        const result = 123;

        const testFactoryName = "testFactoryName";

        class TestFactoryClass {
            public getVal(): number {
                return result;
            }
        }

        cv.set("factory", [], TestFactoryClass, testFactoryName);

        class ConsumerClass {
            @Autowired(cv, testFactoryName)
            private readonly injectedDependency: any;

            public getVal(): number {
                return this.injectedDependency.getVal();
            }
        }

        expect(new ConsumerClass().getVal()).toBe(result);
    });

    it("Asserts that @Autowired works with @Injectable", () => {
        const cv = new Chevron();
        const result = 123;

        const testFactoryName = "testFactoryName";

        @Injectable(cv, InjectableType.FACTORY, [], testFactoryName)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestFactoryClass {
            public getVal(): number {
                return result;
            }
        }

        class ConsumerClass {
            @Autowired(cv, testFactoryName)
            private readonly injectedDependency: any;

            public getVal(): number {
                return this.injectedDependency.getVal();
            }
        }

        expect(new ConsumerClass().getVal()).toBe(result);
    });
});
