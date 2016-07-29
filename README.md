![ChevronJS](/chevron-logo.png)

# Chevron.js

> An extremely small JavaScript service/dependency library

## Introduction

Chevron is a extremely small(1.3kB) JavaScript service library for easy dependency managment and lazy module loading, inspired by [BottleJS](https://github.com/young-steveo/bottlejs) and the [AngularJS Module API](https://docs.angularjs.org/api/ng/type/angular.Module).

## Syntax

### Constructor

To do anything with Chevron, you need to create a new Chevron Container:

```javascript
var cv = new Chevron();
```

### Services

Services are the bread and butter of Chevron, being the most common way to declare a new component.

```javascript

//Chevron.prototype.service(name,[dependencies],content);
cv.service("foo",[],
  function(){
      return 12;
  }
);

var foo = cv.access("foo");
foo();//returns 12
```

or with dependencies

```javascript

cv.service("foo",[],
  function(){
      return 12;
  }
);

cv.service("bar",["foo"],
  function(foo, int){
      return int * foo();
  }
);

var bar = cv.access("bar");
bar(2);//returns 24
```

### Factories

Factories are like Services but are treated as Constructors instead of classic functions.

```javascript
//Chevron.prototype.factory(name,[dependencies],Constructor);
cv.factory("foo",[],
  function(){
      this.foo = 12;
      this.bar = 17;
  }
);

var foo = cv.access("foo");
foo.bar;//returns 17
```

or combined with a service

```javascript
cv.factory("foo",[],
  function(int){
      this.foo = 12;
      this.bar = 17;
  }
);

cv.service("bar",["foo"],
  function(foo, int){
      return int * foo.foo;
  }
);

var bar = cv.access("bar");
bar(3);//returns 21
```

### Accessing services

Services and Factories can be accessed in two ways:

```javascript
cv.access("foo"); //returns the service with dependencies injected into arguments
```

or, if you just want the service without dependencies from the chevron container(called chev):

```javascript
cv.chev.foo; //returns the service as Chevron object.
```

## Options

The Chevron Constructor can be called with options:

```javascript
//Chevron.prototype.service(name = "Chevron");
var namedCv = new Chevron("myCustomContainer");
```

# FAQ

- **Q: Why are there no middleware/decorators?**
- A: I actually had middleware/decorators in version 1.x, but I removed them because I felt like the lib should focus more on being tiny than on more features
