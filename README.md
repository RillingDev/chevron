![ChevronJS](/chevron-logo.png)

# Chevron.js

> An extremely small JavaScript service/dependency library

## Introduction

Chevron is a extremely small JavaScript service library for easy dependency managment inspired by [BottleJS](https://github.com/young-steveo/bottlejs) and the [AngularJS Module API](https://docs.angularjs.org/api/ng/type/angular.Module).

Chevron comes in two forms: normal and lite.

- Normal has all features while also having the larger filesize.
- Lite has the base features, but no decorator/middleware support

## Syntax

### Services

Services are the bread and butter of Chevron, being the most common way to declare a new component.

```javascript
var cv = new Chevron();

//Chevron.prototype.service(name,[dependencies],content);
cv.service("foo",[],
  function(a){
      console.log(a);
  }
);

//Service with dependencies.
cv.service("bar",["foo"],
  function(b){
      console.log(b);
  }
);
```

### Factories

Factories are like Services but are treated as Constructors instead of classic functions and is constructed with arguments.

```javascript
//Chevron.prototype.factory(name,[dependencies],Constructor,[arguments]);
cv.factory("foo",[],
  function(a){
      this.foo=a;
      this.bar=a + "bar"
  },
  ["bar"]
);
```

### Accessing services

Services and Factories can be accessed in two ways:

```javascript
cv.access("foo"); //returns the service with dependencies bound into 'this'.
```

or, if you just want the service without dependencies:

```javascript
cv.container.foo; //returns the service as variable.
```

## Middleware and Decorators

_Middleware/Decorators excluded in the lite version_

### Middleware

Middleware can be used to inject a function into a service, causing the service to call the middleware everytime the service is called

```javascript
//Chevron.prototype.middleware(fn,[services]);
cv.middleware(
    function(){
        console.log("myCustomService is being run!")
    },
    ["myCustomService"]
);

//Or inject into all services
cv.middleware(
    function(name, foo, bar){
        console.log(name + " was called")
    }
);
```

### Decorator

Decorators are run before initializing the service, returning a modified version of it.

```javascript
//Chevron.prototype.decorator(fn,[services]);
cv.decorator(
    function(service){
      service = function() {
          this.foo = 10;
          this.bar = 4;
      };
      return service;
    },
    ["myCustomService"]
);
```

## Options

The Chevron Constructor can be called with options

```javascript
//Chevron.prototype.service(name = "Chevron");
var namedCv = new Chevron("myCustomContainer");
```
