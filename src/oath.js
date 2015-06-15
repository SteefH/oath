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
  var promiseFuncs = {
    defer: function () {
      var deferred = {};
      deferred.promise = new Promise(function (resolve, reject) {
        deferred.resolve = resolve;
        deferred.reject = reject;
      });
      return deferred;
    }
  };

  return {
    breaker: breaker
  };

  function configure(options) {
    promiseFuncs.defer = options.defer || promiseFuncs.defer;
  }

  function breaker(fn) {
    if (!isFunction(fn)) {
      throw new Error('Not a function');
    }
    return (function () {
      var lastCallData = {};
      return function wrapper() {
        var deferredForThisCall = promiseFuncs.defer();
        lastCallData.deferred = null; // signal the preceding resolve handler that the promise should be abandoned
        lastCallData = { deferred: deferredForThisCall };
        var result = fn.apply(this, arguments);
        asPromise(result).then(
          createResolveHandler(lastCallData),
          createRejectHandler(lastCallData)
        );
        return deferredForThisCall.promise;
      };
    }());

    function asPromise(value) {
      if (isPromise(value)) {
        return value;
      }
      var deferred = promiseFuncs.defer();
      deferred.resolve(value);
      return deferred.promise;
    }

    function createResolveHandler(callData) {
      return function (v) {
        callData.deferred && callData.deferred.resolve(v);
      }
    }

    function createRejectHandler(callData) {
      return function (v) {
        callData.deferred && callData.deferred.reject(v);
      }
    }

  }

  function isFunction(fn) {
    return fn && {}.toString.call(fn) == '[object Function]';
  }

  function isPromise(obj) {
    return typeof obj === 'object' && isFunction(obj.then);
  }

}));
