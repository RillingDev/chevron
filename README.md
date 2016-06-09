# chevron.js

chevronjs is a extremely small JavaScript service library for easy dependency managment.

## Syntax

### Services

```javascript
var cv = new Chevron();


//Chevron.prototype.service(name,[dependencies],content);
cv.service("foo",[],function(a){
    console.log(a);
});

//Service with dependencies.
cv.service("bar",["foo"],function(b){
    console.log(b);
});
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
