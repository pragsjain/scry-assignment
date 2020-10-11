console.log('hello!');
var value = function(fn){
    if (typeof fn==String)
    return fn;
    else{
        return fn();
    }
}

var scalar = 'foo';
var fn = function() { return 'bar'; };
var fn2 = function() {
  return fn;
};
var fn3 = function() {
  return fn2;
};
var innerPeace = function() {
  return function() {
    return function() {
      return function() {
        return function() {
          return function() {
            return function() {
              return function() {
                return function() {
                  return '42';
                };
              };
            };
          };
        };
      };
    };
  };
};

value(scalar);   // should be      'foo'
value(fn);          // should be      'bar'
value(fn2);        // should also be 'bar'
value(fn3);       // should also be 'bar'
value(innerPeace);     // should be '42'