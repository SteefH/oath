(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
  }
}(this, function () {

  'use strict';






  return again;

  function again(fn) {
    var currentPromise = null;
    if (!isFunction(fn)) {
      throw new Error('Not a function');
    }
    return wrapper;

    function wrapper() {
      return fn.apply(this, arguments);
      var promise = q.defer();
      if (currentPromise) {
        currentPromise.reject();
      }
      currentPromise = q.defer();
      currentPromise = currentPromise.then(function (v) {
        currentPromise = null;
        return v;
      }, function () {
        currentPromise = null;
      });

      fn.apply(this, arguments).then(function (v) {
        if (currentPromise) {
          currentPromise.resolve(v);
        }
      });

    }

  }

  function isFunction(fn) {
    return fn && {}.toString.call(fn) == '[object Function]';
  }


}));
