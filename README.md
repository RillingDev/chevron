![ChevronJS](./logo.png)

# ChevronJS

> A super tiny JavaScript library for module declaration

## Introduction

Chevron is an extremely small(650Bytes) JavaScript library for easy module declaration,
dependency management and lazy module loading,
inspired by [BottleJS](https://github.com/young-steveo/bottlejs), and the [AngularJS Module API](https://docs.angularjs.org/api/ng/type/angular.Module).

[Demo](http://codepen.io/FelixRilling/pen/AXgydJ)

## Usage

Chevron can be installed via the npm registry:

```shell
npm install chevronjs -S
```

or with yarn

```shell
yarn add chevronjs -S
```

## Syntax

### Constructor

To start with Chevron, you need to create a new Chevron container:

```javascript
const cv = new Chevron();
```

### Module Types

Chevron comes with two built-in types.

#### Services

Services are the most common type of module. A service is simply a function wrapped by Chevron to inject dependencies.
The syntax for `service` is as follows:

```javascript
// Create new service
cv.set("myService", "service", [], function() {
    return 12;
});
// Get service from the Chevron Container
const myService = cv.get("myService");
myService(); // => 12
```

With dependencies:

```javascript
cv.set("myService", "service", [], function() {
    return 12;
});

// Declare the service "foo" as dependency and as function argument
cv.set("myOtherService", "service", ["myService"], function(myService, int) {
    return int * myService();
});

const myOtherService = cv.get("myOtherService");
myOtherService(2); // => 24
```

#### Factories

Factories are very similar to services but are treated as **constructors** instead of functions.
Factories can be called with the `factory` method.

```javascript
// Create new factory
cv.set("myFactory", "factory", [], function() {
    this.foo = 12;
    this.bar = 17;
});

const myFactory = cv.get("myFactory");
myFactory.bar; // => 17
```

Combined with a service:

```javascript
cv.set("myFactory", "factory", [], function() {
    this.foo = 7;
    this.bar = 17;
});

cv.set("myService", "service", ["myFactory"], function(myFactory, int) {
    return int * myFactory.foo;
});

const myService = cv.get("myService");
myService(3); // => 21
```

## API

You can easily create your own type by using the Chevron API.
To declare a new type, simply call add a typeName and constructorFunction for your new type on the type map of a chevron instance:

```javascript
cv.$.set("myType", function(moduleContent, dependencies) {
    console.log("Hello World");

    return moduleContent;
});
```

You'll probably want to start by using a modified version of the default Service or Factory constructorFunction.
After you created the new type, you can use it when setting a new entry:

```javascript
//Chevron.prototype.#name#(name,[dependencies],content);
cv.set("myTypeModule", "myType", [], function() {
    return "bar";
});
```
