import {asPromise, defer} from '../promiseUtils';
import {isFunction} from '../typeTests';

export default function keeper(fn) {
  if (!isFunction(fn)) {
    throw new Error('Not a function');
  }

  var hasPendingCall = false;

  return function wrapper() {

    if (hasPendingCall) {
      return defer().promise; // will never settle
    }
    hasPendingCall = true;
    var result = fn.apply(this, [].slice.call(arguments));

    return asPromise(result).then(
      function (v) {
        hasPendingCall = false;
        return v;
      },
      function (e) {
        hasPendingCall = false;
        throw e;
      }
    );
  };
}
