# ChevronJS

> A TypeScript IoC library for lazy dependency injection.

## Introduction

Chevron is a TypeScript IoC library for lazy dependency injection inspired by the
[AngularJS Module API](https://docs.angularjs.org/api/ng/type/angular.Module)
and [Spring's DI System](https://www.baeldung.com/inversion-control-and-dependency-injection-in-spring).
Unlike similar libraries like [InversifyJS](https://github.com/inversify/InversifyJS),
[Ana](https://github.com/manole-ts/ana) and others, Chevron does not depend on reflection metadata
or compile time tooling; The trade-off by not using those is that less type
validation and Quality of Life features are possible.

**Not suitable for production, use [InversifyJS](https://github.com/inversify/InversifyJS) instead of this**.

[Docs](https://felixrilling.github.io/chevron/)

## Usage

```shell
npm install chevronjs
```

Basic usage:

```typescript
import { Chevron } from "chevronjs";

// Create a new chevron instance.
const chevron = new Chevron<null>();

type LoggingNoop = () => void;

const myFunction: LoggingNoop = () => {
    console.log("Hello world!");
};

// Register the myFunction variable as a plain injectable.
chevron.registerInjectable<LoggingNoop, LoggingNoop>(myFunction);

// Retrieve injectable (could also be done using `chevron.getInjectableInstance("myFunction")`.
const myFunctionInstance = chevron.getInjectableInstance<LoggingNoop>(
    myFunction
);
```

Custom names can be set like this:

```typescript
import { Chevron } from "chevronjs";

const chevron = new Chevron<null>();

type LoggingNoop = () => void;

const myFunction: LoggingNoop = () => {
    console.log("Hello world!");
};
chevron.registerInjectable<LoggingNoop, LoggingNoop>(myFunction, {
    // A custom name can either be a string or another nameable value like a function.
    name: "myCoolName",
});

const myFunctionInstance = chevron.getInjectableInstance<LoggingNoop>(
    "myCoolName"
);
```

### Factories

A core feature are factories, which describe the process how injectable instances are created. The default factory for this is `DefaultFactory.IDENTITY` which means that values are not modified during instantiation. When dealing with dependencies though (Chapter "Dependencies"), it is essential to have a factory which allows usage of those dependencies: `DefaultFactory.CLASS` allows class-like injectables to receive their dependencies as constructor parameters and `DefaultFactory.FUNCTION` allows injectables that are plain functions to simply receive them as arguments.

```typescript
import { Chevron, InjectableClassInitializer, DefaultFactory } from "chevronjs";

const chevron = new Chevron<null>();

class MyClass {
    private readonly modifier: number;

    public constructor() {
        this.modifier = 2;
    }

    public getDouble(n: number): number {
        return n * this.modifier;
    }
}

chevron.registerInjectable<MyClass, InjectableClassInitializer<MyClass, void>>(
    MyClass,
    {
        // Use the "CLASS" factory to instantiate the value as class
        factory: DefaultFactory.CLASS(),
    }
);

const myClassInstance = chevron.getInjectableInstance<MyClass>(MyClass);
```

```typescript
import { Chevron, DefaultFactory } from "chevronjs";

const chevron = new Chevron<null>();

type MathUnaryOperation = (val: number) => number;
const multiply: MathUnaryOperation = (val: number) => val * 2;

const myFunction: () => MathUnaryOperation = () => multiply;
chevron.registerInjectable<MathUnaryOperation, () => MathUnaryOperation>(
    myFunction,
    {
        // Use the "FUNCTION" factory to instantiate the value as a function
        factory: DefaultFactory.FUNCTION(),
    }
);

const myFunctionInstance = chevron.getInjectableInstance<MathUnaryOperation>(
    myFunction
);
```

Custom factories can also be used to modify values during instantiation:

```typescript
import { Chevron } from "chevronjs";

const chevron = new Chevron<null>();

const myInjectable = 16;
chevron.registerInjectable<number, number>(myInjectable, {
    factory: (val: number) => val * 2,
    name: "val",
});

const myFunctionInstance = chevron.getInjectableInstance<number>("val");
```

### Dependencies

When an injectable relies on others in order to be instantiated, you can declare those as its dependencies:

```typescript
import { Chevron, InjectableClassInitializer, DefaultFactory } from "chevronjs";

const chevron = new Chevron<null>();

type MathFn = (a: number) => number;
const doublingFn: MathFn = (a: number) => a * 2;

chevron.registerInjectable<MathFn, MathFn>(doublingFn);

class MyClass {
    public constructor(private readonly doublingFnAsDep: MathFn) {}

    public getDouble(n: number): number {
        return this.doublingFnAsDep(n);
    }
}

/*
 * Register injectable with dependency - we could also use `["doublingFn"]`.
 * We want MyClass to be instantiated by constructing it through the CLASS factory,
 * where we will have the dependencies as constructor parameters.
 */
chevron.registerInjectable<MyClass, InjectableClassInitializer<MyClass>>(
    MyClass,
    {
        dependencies: [doublingFn],
        factory: DefaultFactory.CLASS(),
    }
);

// When retrieving, all dependencies will be resolved first.
const myClassInstance = chevron.getInjectableInstance<MyClass>(MyClass);
```

All dependencies and sub-dependencies will be resolved and instantiated if needed when retrieving an injectable that needs to be instantiated.

### Scopes

Injectables can have scopes defining when new instances are created and reused; By default, `DefaultScopes.SINGLETON` is used, meaning only a single instance of each injectable will be created which will be reused for every retrieval. There is also `DefaultScopes.PROTOTYPE` which is the opposite, creating a new instance for every single request.

```typescript
import {
    Chevron,
    InjectableClassInitializer,
    DefaultFactory,
    DefaultScope,
} from "./src/main";

const chevron = new Chevron<null>();

class MyClass {}

chevron.registerInjectable<MyClass, InjectableClassInitializer<MyClass, void>>(
    MyClass,
    {
        factory: DefaultFactory.CLASS(),
        scope: DefaultScope.PROTOTYPE(),
    }
);

const myClassInstance1 = chevron.getInjectableInstance<MyClass>(MyClass);
const myClassInstance2 = chevron.getInjectableInstance<MyClass>(MyClass);
```

Scopes can be also be used to provide for example session based instances:

```typescript
import {
    Chevron,
    DefaultFactory,
    InjectableClassInitializer,
} from "./src/main";

interface SessionContext {
    sessionId: string;
}

const chevron = new Chevron<SessionContext>();

class MySession {}

chevron.registerInjectable<
    MySession,
    InjectableClassInitializer<MySession, void>
>(MySession, {
    factory: DefaultFactory.CLASS(),
    // Define a custom scope to create scopes based on the property `sessionId` of the context.
    scope: (context: SessionContext | null) => {
        if (context == null) {
            return "DEFAULT";
        }
        return context.sessionId;
    },
});

// Injectable retrieval can pass optional context data to influence scoping.
const mySessionInstanceFoo = chevron.getInjectableInstance<MySession>(
    MySession,
    {
        sessionId: "123",
    }
);
const mySessionInstanceBar = chevron.getInjectableInstance<MySession>(
    MySession,
    {
        sessionId: "987",
    }
);
const mySessionInstanceBarAgain = chevron.getInjectableInstance<MySession>(
    MySession,
    { sessionId: "987" }
);
```

Note that if a scope function returns `null`, a new instance, that will not be re-used, will be created.

## TypeScript Decorators

Chevron provides also provides [TypeScript Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html) for its API.
Keep in mind that decorators are an experimental TypeScript feature and might not be fully stabilized yet.

```typescript
import { Chevron, Injectable } from "./src/main";

const chevron = new Chevron<null>();

// Same as chevron.registerInjectable(Foo, { factory: DefaultFactory.CLASS() });
@Injectable<Foo>(chevron)
class Foo {
    public getFoo(): string {
        return "foo";
    }
}

@Injectable<FooBar>(chevron, {
    dependencies: [Foo],
})
class FooBar {
    public constructor(private readonly foo: Foo) {}

    public getFooBar(): string {
        return this.foo.getFoo() + "bar";
    }
}

const fooBarInstance = chevron.getInjectableInstance<FooBar>(FooBar);
```
