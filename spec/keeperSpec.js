'use strict';
// import './helpers/matchers/toBeFunction.js';
import es6Promise from 'es6-promise';
import oath from '../src/oath.js';

es6Promise.polyfill();

describe('calling oath.keeper()',  () => {
  it('should throw an exception when anything but a function is passed as its first argument', () => {
    var callWithString    = () => oath.keeper('dummy');
    var callWithNumber    = () => oath.keeper(0);
    var callWithBoolean   = () => oath.keeper(true);
    var callWithNull      = () => oath.keeper(null);
    var callWithUndefined = () => oath.keeper(undefined);
    var callWithObject    = () => oath.keeper({});
    var callWithArray     = () => oath.keeper([]);

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
      var wrapped = oath.keeper(fn);
      expect(wrapped).not.toBe(fn);
      expect(wrapped).toBeFunction();
    });

    describe('returns a function that', () => {

      var originalFunction, wrappedFunction;

      beforeEach(() => {
        originalFunction = jasmine.createSpy('originalFunction').and.returnValue(0);
        wrappedFunction = oath.keeper(originalFunction);
      });

      it('should pass its arguments to the wrapped function', (done) => {

        wrappedFunction(1, 2, 3);
        expect(originalFunction).toHaveBeenCalled();
        expect(originalFunction.calls.mostRecent().args).toEqual([1, 2, 3]);

        setTimeout(() => {
          // this is wrapped in a timeout to fulfill the pending promise
          originalFunction.calls.reset();
          wrappedFunction();
          expect(originalFunction).toHaveBeenCalled();
          expect(originalFunction.calls.mostRecent().args).toEqual([]);
          done();
        });

      });

      it('should pass its context to the wrapped function', (done) => {
        var objWithMethod = {
          method: wrappedFunction
        };
        objWithMethod.method();
        expect(originalFunction.calls.mostRecent().object).toBe(objWithMethod);

        setTimeout(() => {
          // this is wrapped in a timeout to fulfill the pending promise
          originalFunction.calls.reset();
          var externalContext = {};
          wrappedFunction.call(externalContext);
          expect(originalFunction.calls.mostRecent().object).toBe(externalContext);

          originalFunction.calls.reset();
          done();
        });

      });

      it('should wrap the original function\'s result in a promise when it\'s not a promise', () => {
        var result = wrappedFunction();
        expect(result).toHaveMethod('then');
      });

      it('should return a promise when the original function\'s result is a promise', () => {
        var wrappedFunction = oath.keeper(() => new Promise(() => {}));
        var result = wrappedFunction();
        expect(result).toHaveMethod('then');
      });
      describe('when called', () => {
        var resolveAfter, rejectAfter, settleAfter;
        resolveAfter = msToWait => new Promise(
          resolve => setTimeout(resolve, msToWait)
        );
        rejectAfter = msToWait => new Promise(
          (resolve, reject) => setTimeout(reject, msToWait)
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
          it(', the returned promise should resolve when the promise returned by the wrapped function resolves ', done => {
            var resolveAfterKeeper = oath.keeper(resolveAfter);
            resolveAfterKeeper(5).then(doneRunner(done, 'ok'));
          });
          it(', the returned promise should be rejected when the promise returned by the wrapped function is rejected', done => {
            var rejectAfterKeeper = oath.keeper(rejectAfter);
            rejectAfterKeeper(5).then(undefined, doneRunner(done, 'ok'));
          });

        });
        describe('repeatedly', () => {
          it('never resolves promises that are returned after the first returned pending promise', done => {
            var resolveAfterKeeper = oath.keeper(resolveAfter);
            var runDone = (txt) => doneRunner(done, txt);
            resolveAfterKeeper(3 ).then(runDone('ok'),                 runDone('should not reject'));
            resolveAfterKeeper(1 ).then(runDone('should not resolve'), runDone('should not reject'));
            resolveAfterKeeper(2 ).then(runDone('should not resolve'), runDone('should not reject'));
            resolveAfterKeeper(10).then(runDone('should not resolve'), runDone('should not reject'));
          });
          it('never rejects promises that are returned after the first returned pending promise', done => {
            var rejectAfterKeeper = oath.keeper(rejectAfter);
            var runDone = (txt) => doneRunner(done, txt);
            rejectAfterKeeper(3).then(runDone('should not resolve'), runDone('ok'));
            rejectAfterKeeper(1).then(runDone('should not resolve'), runDone('should not reject'));
            rejectAfterKeeper(2).then(runDone('should not resolve'), runDone('should not reject'));
            rejectAfterKeeper(1).then(runDone('should not resolve'), runDone('should not reject'));
          });
          it('never settles promises that are returned after the first returned pending promise', done => {
            var settleKeeper = oath.keeper((succes, msToWait) => new Promise(
              (resolve, reject) => setTimeout(success ? resolve: reject, msToWait)
            ));
            var runDone = (txt) => doneRunner(done, txt);
            settleKeeper(false, 50).then(runDone('should not resolve'), runDone('ok'));
            settleKeeper(false, 10).then(runDone('should not resolve'), runDone('should not reject'));
            settleKeeper(true,  20).then(runDone('should not resolve'), runDone('should not reject'));
            settleKeeper(false, 30).then(runDone('should not resolve'), runDone('should not reject'));
            settleKeeper(true,  40).then(runDone('should not resolve'), runDone('should not reject'));
          });
        });


      });
    });

  });
});
