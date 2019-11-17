import { Chevron } from "../../../src/Chevron";
import { Autowired } from "../../../src/decorators/Autowired";
import { Injectable } from "../../../src/decorators/Injectable";
import { Bootstrappers } from "../../../src/bootstrap/Bootstrappers";

describe("Injectable tests", () => {
    it("Asserts that @Injectable works", () => {
        const cv = new Chevron();
        const result = 123;

        const testFactoryName = "testFactoryName";

        @Injectable(cv, Bootstrappers.CLASS, [], testFactoryName)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestFactoryClass {
            public getVal(): number {
                return result;
            }
        }

        expect(cv.getInjectableInstance(testFactoryName).getVal()).toBe(result);
    });

    it("Asserts that @Injectable can infer the name", () => {
        const cv = new Chevron();

        const result = 123;

        @Injectable(cv, Bootstrappers.CLASS, [])
        class TestFactoryClass {
            public getVal(): number {
                return result;
            }
        }

        class ConsumerClass {
            @Autowired(cv, TestFactoryClass)
            private readonly injectedDependency: any;

            public getVal(): number {
                return this.injectedDependency.getVal();
            }
        }

        expect(new ConsumerClass().getVal()).toBe(result);
    });
});
