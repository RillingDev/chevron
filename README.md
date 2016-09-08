![ChevronJS](./logo.png)

# Chevron.js

> An super tiny JavaScript service library

## Introduction

Chevron is an extremely small(1.0kB) JavaScript service library for easy dependency managment and lazy module loading, inspired by [BottleJS](https://github.com/young-steveo/bottlejs) and the [AngularJS Module API](https://docs.angularjs.org/api/ng/type/angular.Module).

[Demo](http://codepen.io/FelixRilling/pen/AXgydJ)

## Usage

Chevron supports both npm and bower:

```shell
npm install chevronjs --save
```

```shell
bower install chevronjs --save
```

## Syntax

### Constructor

To start with Chevron, you need to create a new Chevron Container:

```javascript
var cv = new Chevron();
```

The Chevron Constructor can be called with options:

```javascript
//Chevron(id = "Chevron");
var namedCv = new Chevron("myCustomContainer");
```

When a named Chevron Instance throws an error, you can identify which Container errored by the id.

### Module Types

#### Services

Services are the most common type of module. A service is simply a function wrapped by chevron + dependencies. The syntax for `service` is as follows:

```javascript

//Create new service
//Chevron.prototype.service(name,[dependencies],function);
cv.service("foo", [],
    function() {
        return 12;
    }
);
//Access service from the Chevron Container
//Chevron.prototype.access(name);
var foo = cv.access("foo");
foo(); //returns 12
```

or with dependencies:

```javascript

cv.service("foo", [],
    function() {
        return 12;
    }
);

//declare the service "foo" as dependency and as function argument
cv.service("bar", ["foo"],
    function(foo, int) {
        return int * foo();
    }
);

var bar = cv.access("bar");
bar(2); //returns 24
```

#### Factories

Factories are very similar to services but are treated as **Constructors** instead of classic functions; Factories have the same syntax as services and can be called with the `factory` method.

```javascript
//Chevron.prototype.factory(name,[dependencies],Constructor);
cv.factory("foo", [],
    function() {
        this.foo = 12;
        this.bar = 17;
    }
);

var foo = cv.access("foo");
foo.bar; //returns 17
```

or combined with a service

```javascript
cv.factory("foo", [],
    function() {
        this.foo = 7;
        this.bar = 17;
    }
);

cv.service("bar", ["foo"],
    function(foo, int) {
        return int * foo.foo;
    }
);

var bar = cv.access("bar");
bar(3); //returns 21
```

### Accessing Services

Services and Factories can be accessed in two ways. In most cases, you will want to get your service trough Chevrons `access` method, which returns the bundled and constructed service

```javascript
//Chevron.prototype.access(name)
cv.access("foo"); //returns the service or factory with dependencies injected into arguments
```

or, if you just want the service without dependencies from the Chevron container(called "chev"):

```javascript
cv.chev.get("foo"); //returns the service as Chevron object.
```

## API

You can easily create your own module type by using the Chevron API. To declare a new type, simpy call the `extend` method with a name and Constructor for your new type:

```javascript
//Chevron.prototype.extend(type,fn);
cv.extend("myType", function(service, bundle) {
    /**
     * your init code here
     */

    //returns the service
    return service;
});
```

In the example above we created a new module type, "myType", with the given function as constructor. You'll probably want to start by using a modified version of the default Service or Factory constructor which you can find in the in ["src/types"](https://github.com/FelixRilling/chevronjs/tree/master/src/types) folder of the repo.

After you created the new type, you can use it by calling the type as a method

```javascript
//Chevron.prototype.#name#(name,[dependencies],content);
cv.myType("foo", [], function() {
    return "bar";
});
```

Then you can simply call `access` again to access your new service type.

```javascript
cv.access("foo");
```

## FAQ

- **Q: Why are there no middleware/decorators?**
- A: I actually had middleware/decorators in version 1.x, but I removed them because I felt like the lib should focus more on being tiny than on more features
