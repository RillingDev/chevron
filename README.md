# chevron.js

chevronjs is a extremely small JavaScript service library for easy dependency managment.

## Syntax

### Services

Services are the bread and butter of Chevron, being the most common way to declare a new component.

```javascript
var cv = new Chevron();
//or
var namedCv= new Chevron("myCustomContainer");

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

#### Acessing services

Services can be accessed in two ways:

```javascript
cv.container.foo; //returns the service as variable.
```

or

```javascript
cv.access("foo"); //returns the service with dependencies bound into 'this'.
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
