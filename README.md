# ChevronJS

> A small TypeScript library for lazy dependency injection.

## Introduction

Chevron is a TypeScript library for lazy dependency injection inspired by the [AngularJS Module API](https://docs.angularjs.org/api/ng/type/angular.Module) and [Spring's DI System](https://www.baeldung.com/inversion-control-and-dependency-injection-in-spring).

[Docs](https://felixrilling.github.io/chevron/)

## Usage

```shell
npm install chevronjs
```

Basic usage:

```typescript
import { Chevron } from "chevronjs";

// Create a new chevron instance
const chevron = new Chevron();

const myFunction = () => {
    console.log("Hello world!");
};

// Register the myFunction variable as a plain injectable.
chevron.registerInjectable(myFunction);

// Retrieve injectable (could also be done using `chevron.getInjectableInstance("myFunction")`.
const myFunctionInstance = chevron.getInjectableInstance(myFunction);
```

Custom names can be set like this:

```typescript
import { Chevron } from "chevronjs";

const chevron = new Chevron();

const myFunction = () => {
    console.log("Hello world!");
};
chevron.registerInjectable(myFunction, {
    // A custom name can either be a string or another nameable value like a function.
    name: "myCoolName"
});

const myFunctionInstance = chevron.getInjectableInstance("myCoolName");
```

### Bootstrapping

A core feature is bootstrapping, which describes the process how injectable instances are instantiated. The default bootstrapping is `DefaultBootstrappings.IDENTITY` which means that values are not modified during instantiation. When dealing with dependencies though (Chapter "Dependencies"), it is essential to have a bootstrapping process which allows usage of those dependencies: `DefaultBootstrappings.CLASS` allows class-like injectables to receive their dependencies as constructor parameters and `DefaultBootstrappings.FUNCTION` allows injectables that are plain functions to simply receive them as arguments.

```typescript
import { Chevron, DefaultBootstrappings } from "chevronjs";

const chevron = new Chevron();

const MyClass = class {
    private readonly modifier: number;

    public constructor() {
        this.modifier = 2;
    }

    public getDouble(n: number) {
        return n * this.modifier;
    }
};
chevron.registerInjectable(MyClass, {
    // Use the "CLASS" Bootstrapping to instantiate the value as class
    bootstrapping: DefaultBootstrappings.CLASS
});

const myClassInstance = chevron.getInjectableInstance(MyClass);
```

```typescript
import { Chevron, DefaultBootstrappings } from "chevronjs";

const chevron = new Chevron();

const multiply = (val: number) => val * 2;

const myFunction = () => multiply;
chevron.registerInjectable(myFunction, {
    // Use the "FUNCTION" Bootstrapping to instantiate the value as a function
    bootstrapping: DefaultBootstrappings.FUNCTION
});

const myFunctionInstance = chevron.getInjectableInstance(myFunction);
```

Bootstrapping can also be used to modify values during instantiation:

```typescript
import { Chevron, DefaultBootstrappings } from "chevronjs";

const chevron = new Chevron();

const myInjectable = 16;
chevron.registerInjectable(myInjectable, {
    bootstrapping: (val: number) => val * 2,
    name: "val"
});

const myFunctionInstance = chevron.getInjectableInstance("val");
```

### Dependencies

When an injectable relies on others in order to be constructed, you can declare those as its dependencies:

```typescript
import { Chevron, DefaultBootstrappings } from "chevronjs";

const chevron = new Chevron();

type mathFnType = (a: number) => number;
const doublingFn: mathFnType = (a: number) => a * 2;

chevron.registerInjectable(doublingFn);

const MyClass = class {
    public constructor(private readonly doublingFnAsDep: mathFnType) {}

    public getDouble(n: number) {
        return this.doublingFnAsDep(n);
    }
};

/*
 * Register injectable with dependency - we could also use `["doublingFn"]`.
 * We want MyClass to be instantiated by constructing it through the CLASS bootstrapping,
 * where we will have the dependencies as constructor parameters.
 */
chevron.registerInjectable(MyClass, {
    dependencies: [doublingFn],
    bootstrapping: DefaultBootstrappings.CLASS
});

// When retrieving, all dependencies will be resolved first.
const myClassInstance = chevron.getInjectableInstance(MyClass);
```

All dependencies and sub-dependencies will be resolved and instantiated if needed when retrieving an injectable that needs to be instantiated.

### Scopes

Injectables can have scopes defining when new instances are created and reused; By default, `DefaultScopes.SINGLETON` is used, meaning only a single instance of each injectable will be created, which will be reused for every retrieval. There is also `DefaultScopes.PROTOTYPE` which is the opposite, creating a new instance for every single request.

```typescript
import { Chevron, DefaultBootstrappings, DefaultScopes } from "./src/main";

const chevron = new Chevron();

interface SessionContext {
    sessionId: string;
}

const MyClass = class {};

chevron.registerInjectable(MyClass, {
    bootstrapping: DefaultBootstrappings.CLASS,
    scope: DefaultScopes.PROTOTYPE
});

const myClassInstance1 = chevron.getInjectableInstance(MyClass);
const myClassInstance2 = chevron.getInjectableInstance(MyClass);
```

Scopes can be also be used to provide for example session based instances:

```typescript
import { Chevron, DefaultBootstrappings } from "./src/main";

const chevron = new Chevron();

interface SessionContext {
    sessionId: string;
}

const MySession = class {};

chevron.registerInjectable(MySession, {
    bootstrapping: DefaultBootstrappings.CLASS,
    // Define a custom scope to create scopes based on the property `sessionId` of the context.
    scope: (context: SessionContext) => context.sessionId
});

// Injectable retrieval can pass optional context data to influence scoping.
const mySessionInstanceFoo = chevron.getInjectableInstance(MySession, {
    sessionId: "123"
});
const mySessionInstanceBar = chevron.getInjectableInstance(MySession, {
    sessionId: "987"
});
const mySessionInstanceBarAgain = chevron.getInjectableInstance(MySession, {
    sessionId: "987"
});
```

Note that if a scope function returns `null`, a new instance that will not be re-used will be created.

## TypeScript Decorators

Chevron provides also provides [TypeScript Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html) for its API.
Keep in mind that decorators are an experimental TypeScript feature and might not be fully stabilized yet.

```typescript
import { Chevron, DefaultBootstrappings, Injectable } from "./src/main";

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
```
