'use strict';
import  again from '../src/again.js';
describe('calling again()', function () {
  it('should throw an exception when anything but a function is passed as its first argument', function () {
    expect(callWithString).toThrow();
    expect(callWithNumber).toThrow();
    expect(callWithBoolean).toThrow();
    expect(callWithNull).toThrow();
    expect(callWithUndefined).toThrow();
    expect(callWithObject).toThrow();
    expect(callWithArray).toThrow();

    function callWithString()    { again('dummy'); }
    function callWithNumber()    { again(0); }
    function callWithBoolean()   { again(true); }
    function callWithNull()      { again(null); }
    function callWithUndefined() { again(undefined); }
    function callWithObject()    { again({}); }
    function callWithArray()     { again([]); }
  });
  describe('with a function as its first argument', function () {

    it('should return a new function', function () {
      var fn = function() {};
      expect(again(fn)).not.toBe(fn);

      // expect(true).toEqual(false);
    });
    describe('returns a function that', function () {

      var originalFunction, wrappedFunction;

      beforeEach(function () {
        originalFunction = jasmine.createSpy('originalFunction');
        wrappedFunction = again(originalFunction);
      })

      it('should pass its arguments to the wrapped function', function () {

        wrappedFunction(1, 2, 3);
        expect(originalFunction).toHaveBeenCalled();
        expect(originalFunction.calls.mostRecent().args).toEqual([1, 2, 3]);

        originalFunction.calls.reset();

        wrappedFunction();
        expect(originalFunction).toHaveBeenCalled();
        expect(originalFunction.calls.mostRecent().args).toEqual([]);
      });

      it('should pass its context to the wrapped function', function () {
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

        var contextForBoundFunction = {};
        var boundFunction = wrappedFunction.bind(contextForBoundFunction);
        boundFunction();
        expect(originalFunction.calls.mostRecent().object).toBe(contextForBoundFunction);
      });

      it('should wrap the original function\'s result in a promise', function () {

      });

    });
  });
});
