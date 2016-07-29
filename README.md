![ChevronJS](/chevron-logo.png)

# Chevron.js

> An extremely small JavaScript service/dependency library

## Introduction

Chevron is a extremely small(1.3kB) JavaScript service library for easy dependency managment and lazy module loading, inspired by [BottleJS](https://github.com/young-steveo/bottlejs) and the [AngularJS Module API](https://docs.angularjs.org/api/ng/type/angular.Module).

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

### Services

Services are the bread and butter of Chevron, being the most common way to declare a new module function.

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

Factories are similar to services but are treated as **Constructors** instead of classic functions.

_Note: since v3.5.x the arguments parameter falls away; when upgrading from < v3.4.x simply remove the last parameter and you should be fine_

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
  function(){
      this.foo = 7;
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
//Chevron.prototype.access(name)
cv.access("foo"); //returns the service or factory with dependencies injected into arguments
```

or, if you just want the service without dependencies from the chevron container(called chev):

```javascript
cv.chev.foo; //returns the service as Chevron object.
```

# API

You can create your own service type/constructor by using the Chevron API. to declare a new type, simpy add a new entry to the "tf" property of your Chevron instance.

```javascript
cv.tf.myType = function(service,bundle){
    //your init code here
    return service;
}
```

In the example above we created a new servicetype "myType" with the given function as constructor. you'll probably want to start by modifying the default Service or Factory constructor which you can find in the tf property as well.

```javascript
//get the default service constructor
cv.tf.factory.toString();
```

When you want to create a new service with your type, you will need to use the "provider" method of the Chevron object (Fun Fact: the "service" and "factory" methods are just a tiny wrapper around the provider function).

```javascript
//Chevron.prototype.provider(type,name,[dependencies],content);
cv.provider("myType","foo",[],function(){
    return "bar";
})
```

after that you can simply call "access" again to access your new service type

```javascript
cv.access("foo");
```

# FAQ

- **Q: Why are there no middleware/decorators?**
- A: I actually had middleware/decorators in version 1.x, but I removed them because I felt like the lib should focus more on being tiny than on more features
