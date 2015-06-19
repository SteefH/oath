export function isFunction(fn) {
  return fn && {}.toString.call(fn) === '[object Function]';
}

export function isPromise(obj) {
  return typeof obj === 'object' && isFunction(obj.then);
}
