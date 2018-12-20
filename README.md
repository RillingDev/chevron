# ChevronJS

> A small TypeScript library for lazy dependency injection.

## Introduction

Chevron is a small TypeScript library for lazy dependency injection inspired by the [AngularJS Module API](https://docs.angularjs.org/api/ng/type/angular.Module) and [Spring's DI System](https://www.baeldung.com/inversion-control-and-dependency-injection-in-spring).

[Docs](https://felixrilling.github.io/chevron/)

## Usage

```shell
npm install chevronjs
```

Chevron can be used in two ways, either the classic programmatic API, calling Chevron#set and Chevron#get to set and get injectables, or by using the typescript decorators `@Injectable` and `@Autowired` on the given values.

```typescript
import {Chevron, InjectableType} from "chevronjs";

const cv = new Chevron(); // Create a new instance which acts as the container for the injectables

/*
 * Classic API.
 */

class MyFactory {
    public sayHello() {
        console.log("Hello!");
    }
}

cv.set(
    InjectableType.FACTORY, // Type of the injectable.
    [], // Dependencies this injectable uses, none in this case.
    MyFactory // Content of the injectable. In this case, it will also be used as the key for accessing the injectable later.
);

cv.get(MyFactory).sayHello(); // Prints "Hello!"
```
Chevron provides two [TypeScript Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html) for its API.
Keep in mind that decorators are an experimental TypeScript feature and might not be fully stabilized yet.
```typescript
import {Chevron, InjectableType, Autowired, Injectable} from "chevronjs";

const cv = new Chevron();

/*
 * Decorator API.
 */

@Injectable(cv, InjectableType.FACTORY, [])
class MyFactory {
    public sayHello() {
        console.log("Hello!");
    }
}

class ConsumerClass {
    @Autowired(cv, MyFactory)
    private readonly injectedMyFactory: any;

    public run() {
        this.injectedMyFactory.sayHello();
    }
}

new ConsumerClass().run(); // Prints "Hello!"
```

### Dependencies

When an injectable relies on others in order to be constructed, you can declare those as its dependencies:

```typescript
import {Chevron, InjectableType} from "chevronjs";

const cv = new Chevron(); // Create a new instance which acts as the container for the injectables

class MyFactory {
    public sayHello() {
        console.log("Hello!");
    }
}

cv.set(
    InjectableType.FACTORY,
    [],
    MyFactory
);

function myService(myFactory: MyFactory) { // Dependency will be available in the service as an argument.
    myFactory.sayHello();
}

cv.set(
    InjectableType.SERVICE,
    [MyFactory], // Key of the dependency is listed here.
    myService
);

cv.get(myService)(); // Prints "Hello!"
```

Upon construction of the injectable, all dependencies will be accessed, and constructed of they are not already.

### Keys

By default, Chevron will try to use the content of an injectable as its key, but if that is not what you want (if you want the same class in two injectables for example) you can provide an explicit key:

```typescript
import {Chevron, InjectableType} from "chevronjs";

const cv = new Chevron();

class MyFactory {
    public sayHello() {
        console.log("Hello!");
    }
}

cv.set(
    InjectableType.FACTORY,
    [],
    MyFactory,
    "myInjectableFactory1"
);

cv.set(
    InjectableType.FACTORY,
    [],
    MyFactory,
    "myInjectableFactory2"
);

cv.get("myInjectableFactory1").sayHello(); // Prints "Hello!"
```

### Injectable Types

Chevron comes with a handful of built-in injectable types:

#### Plain

A value that does not need to be constructed, and can be used as-is.

```typescript
import {Chevron, InjectableType} from "chevronjs";

const cv = new Chevron();
const result = 123;

const testPlainName = "testPlainName";
cv.set(InjectableType.PLAIN, [], result, testPlainName);

cv.get(testPlainName); // returns 123
```

####  Factory
 
A constructor function/class, that will be constructed with the given dependencies as arguments.

```typescript
import {Chevron, InjectableType} from "chevronjs";

const cv = new Chevron();
const result = 123;

const testFactoryName = "testFactoryName";

class TestFactoryClass {
    // noinspection JSMethodCanBeStatic
    public getVal() {
        return result;
    }
}

cv.set(InjectableType.FACTORY, [], TestFactoryClass, testFactoryName);

cv.get(testFactoryName).getVal(); // returns 123
```

####  Service
 
A function that takes the given dependencies and content as arguments.

```typescript
import {Chevron, InjectableType} from "chevronjs";

const cv = new Chevron();
const result = 123;

const testServiceName = "testServiceName";
const testServiceFn = () => result;
cv.set(InjectableType.SERVICE, [], testServiceFn, testServiceName);

cv.get(testServiceName)(); // returns 123
```

### API

You can add your own injectable types to provide custom bootstrapping behaviour:

```typescript
import {Chevron, InjectableType} from "chevronjs";

const cv = new Chevron();

const MY_INJECTABLE_TYPE = "myType";
cv.setType(MY_INJECTABLE_TYPE, (content, dependencies) => content * 2);

const testInjectable = "testInjectable";
const testVal = 123;
cv.set(MY_INJECTABLE_TYPE, [], testVal, testInjectable);

cv.get(testInjectable); // returns 246
```
