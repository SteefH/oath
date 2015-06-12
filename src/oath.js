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
    root.oath = factory();
  }
}(this, function () {

  'use strict';
  var promiseFuncs;
  initialize();

  return {
    breaker: breaker
  };

  function initialize() {
    promiseFuncs = {
      defer: function () {
        var result = {
          resolve: function () {},
          reject: function () {},
          promise: new Promise(function (resolve, reject) {
            result.resolve = resolve;
            result.reject = reject;
          })
        };
        return result;
      },
      resolve: function (value) {
        return this.resolve(value);
      },
      reject: function (value) {
        return this.reject(value);
      },
      getPromise: function() {
        return this.promise;
      }
    };
  }

  function configure(options) {
    promiseFuncs = 'defer resolve reject getPromise'.split(' ').reduce(function (funcs, member) {
      funcs[member] = options[member] || funcs[member];
      return funcs;
    });

  }

  function breaker(fn) {
    if (!isFunction(fn)) {
      throw new Error('Not a function');
    }
    return wrapper;

    function wrapper() {

      var result = fn.apply(this, arguments);
      if (typeof result === 'object' && isFunction(result.then)) {
        return result;
      }
      var deferred = promiseFuncs.defer();
      promiseFuncs.resolve.call(deferred, result);
      return promiseFuncs.getPromise.call(deferred);
    }

  }

  function isFunction(fn) {
    return fn && {}.toString.call(fn) == '[object Function]';
  }


}));
