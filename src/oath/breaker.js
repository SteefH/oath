

import {defer, asPromise} from '../promiseUtils';
import {isFunction} from '../typeTests';

export default function breaker(fn) {
  if (!isFunction(fn)) {
    throw new Error('Not a function');
  }
  var lastCallData = {};
  return function wrapper() {
    var deferredForThisCall = defer();
    lastCallData.deferred = null; // signal the preceding resolve/reject handlers that the promise should be abandoned
    lastCallData = { deferred: deferredForThisCall };
    var result = fn.apply(this, arguments);
    asPromise(result).then(
      createResolveHandler(lastCallData),
      createRejectHandler(lastCallData)
    );
    return deferredForThisCall.promise;
  };
}

function createResolveHandler(callData) {
  return v => callData.deferred && callData.deferred.resolve(v);
}

function createRejectHandler(callData) {
  return v => callData.deferred && callData.deferred.reject(v);
}
