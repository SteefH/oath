'use strict';
// import './helpers/matchers/toBeFunction.js';
import es6Promise from 'es6-promise';
import oath from '../src/oath.js';

es6Promise.polyfill();

describe('calling oath.breaker()',  () => {
  it('should throw an exception when anything but a function is passed as its first argument', () => {
    var callWithString    = () => oath.breaker('dummy');
    var callWithNumber    = () => oath.breaker(0);
    var callWithBoolean   = () => oath.breaker(true);
    var callWithNull      = () => oath.breaker(null);
    var callWithUndefined = () => oath.breaker(undefined);
    var callWithObject    = () => oath.breaker({});
    var callWithArray     = () => oath.breaker([]);

    expect(callWithString).toThrow();
    expect(callWithNumber).toThrow();
    expect(callWithBoolean).toThrow();
    expect(callWithNull).toThrow();
    expect(callWithUndefined).toThrow();
    expect(callWithObject).toThrow();
    expect(callWithArray).toThrow();
  });
  describe('with a function as its first argument', () => {

    it('should return a new function', () => {
      var fn = () => undefined;
      var wrapped = oath.breaker(fn);
      expect(wrapped).not.toBe(fn);
      expect(wrapped).toBeFunction();
    });
    describe('returns a function that', () => {

      var originalFunction, wrappedFunction;

      beforeEach(() => {
        originalFunction = jasmine.createSpy('originalFunction');
        wrappedFunction = oath.breaker(originalFunction);
      });

      it('should pass its arguments to the wrapped function', () => {

        wrappedFunction(1, 2, 3);
        expect(originalFunction).toHaveBeenCalled();
        expect(originalFunction.calls.mostRecent().args).toEqual([1, 2, 3]);

        originalFunction.calls.reset();

        wrappedFunction();
        expect(originalFunction).toHaveBeenCalled();
        expect(originalFunction.calls.mostRecent().args).toEqual([]);
      });

      it('should pass its context to the wrapped function', () => {
        var objWithMethod = {
          method: wrappedFunction
        };
        objWithMethod.method();
        expect(originalFunction.calls.mostRecent().object).toBe(objWithMethod);

        originalFunction.calls.reset();

        var externalContext = {};
        wrappedFunction.call(externalContext);
        expect(originalFunction.calls.mostRecent().object).toBe(externalContext);

        originalFunction.calls.reset();

      });

      it('should wrap the original function\'s result in a promise when it\'s not a promise', () => {
        var result = wrappedFunction();
        expect(result).toHaveMethod('then');
      });

      it('should return a promise when the original function\'s result is a promise', () => {
        var wrappedFunction = oath.breaker(() => new Promise(() => {}));
        var result = wrappedFunction();
        expect(result).toHaveMethod('then');
      });

      describe('when called', () => {
        var resolveAfter = oath.breaker(
          msToWait => new Promise(
            resolve => setTimeout(resolve, msToWait)
          )
        );
        var rejectAfter = oath.breaker(
          msToWait => new Promise(
            (resolve, reject) => setTimeout(reject, msToWait)
          )
        );
        function doneRunner(done, v) {
          return function () {
            expect(v).toEqual('ok');
            done();
          };
        }
        var originalTimeout;
        beforeEach(() => {
          originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
          jasmine.DEFAULT_TIMEOUT_INTERVAL = 100;
        });
        afterEach(() => jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout);

        describe('once', () => {
          it(', the returned promise should resolve when the promise returned by the wrapped function resolves ', (done) => {
            resolveAfter(5).then(doneRunner(done, 'ok'));
          });
          it(', the returned promise should be rejected when the promise returned by the wrapped function is rejected', (done) => {
            rejectAfter(5).then(undefined, doneRunner(done, 'ok'));
          });

        });
        describe('repeatedly', () => {
          it('never resolves previously returned pending promises', (done) => {
            resolveAfter(1).then(doneRunner(done, 'should not resolve after 1'));
            resolveAfter(2).then(doneRunner(done, 'should not resolve after 2'));
            resolveAfter(10).then(doneRunner(done, 'should not resolve after 10'));
            resolveAfter(3).then(doneRunner(done, 'ok'));
          });
          it('never rejects previously returned pending promises', (done) => {
            rejectAfter(1).then(undefined, doneRunner(done, 'should not resolve after 1'));
            rejectAfter(2).then(undefined, doneRunner(done, 'should not resolve after 2'));
            rejectAfter(10).then(undefined, doneRunner(done, 'should not resolve after 10'));
            rejectAfter(3).then(undefined, doneRunner(done, 'ok'));
          });
          xit('never settles previously returned pending promises', (done) => {
            rejectAfter(10).then(undefined, doneRunner(done, 'should not resolve after 1'));
            resolveAfter(20).then(doneRunner(done, 'should not resolve after 2'));
            rejectAfter(30).then(undefined, doneRunner(done, 'should not resolve after 3'));
            resolveAfter(40).then(doneRunner(done, 'should not resolve after 4'));
            rejectAfter(50).then(undefined, doneRunner(done, 'ok'));
          });
        });


      })
    });
  });
});
