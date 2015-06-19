import 'es6-promise';

import {isPromise} from './typeTests';

var deferredFactory = function () {
  var deferred = {};
  deferred.promise = new Promise(function (resolve, reject) {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
};

export function setDeferredFactory(fn) {
  deferredFactory = fn;
}

export function defer() {
  return deferredFactory();
}

export function asPromise(value) {
  if (!isPromise(value)) {
    var deferred = defer();
    deferred.resolve(value);
    value = deferred.promise;
  }
  return value;
}
