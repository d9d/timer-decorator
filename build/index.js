'use strict';

require('source-map-support/register');

// @providesModule decorators/timer

const instances = new WeakMap();
let counter = 0;

function addToMap(instance) {
  const inst = { enabled: true, index: counter++ };

  instances.set(instance, inst);

  return inst;
}

function getIndex(instance) {
  return (instances.get(instance) || addToMap(instance)).index;
}

function toggle(instance, enabled) {
  (instances.get(instance) || addToMap(instance)).enabled = enabled;
}

function isEnabled(instance) {
  return instances.has(instance) ? instances.get(instance).enabled : addToMap(instance).enabled;
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

module.exports = function (target, key, descriptor) {
  const fn = descriptor.value;

  descriptor.value = function (...args) {
    if (isEnabled(this)) {
      const instanceNum = getIndex(this);
      const timingName = `${this.constructor.name}#${instanceNum}.${key}`;
      const self = this;
      let retVal = null;

      console.time(timingName);
      retVal = fn.apply(self, args);

      if (isPromise(retVal)) {
        retVal.then(console.timeEnd.bind(console, timingName));
      } else {
        console.timeEnd(timingName);
      }

      return retVal;
    } else {
      return fn.call(this, arguments);
    }
  };

  return descriptor;
};

module.exports.enable = function (instance) {
  toggle(instance, true);

  return this;
};

module.exports.disable = function (instance) {
  toggle(instance, false);

  return this;
};

module.exports.release = function (instance) {
  instances.delete(instance);

  return this;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJpbnN0YW5jZXMiLCJXZWFrTWFwIiwiY291bnRlciIsImFkZFRvTWFwIiwiaW5zdGFuY2UiLCJpbnN0IiwiZW5hYmxlZCIsImluZGV4Iiwic2V0IiwiZ2V0SW5kZXgiLCJnZXQiLCJ0b2dnbGUiLCJpc0VuYWJsZWQiLCJoYXMiLCJpc1Byb21pc2UiLCJvYmoiLCJ0aGVuIiwibW9kdWxlIiwiZXhwb3J0cyIsInRhcmdldCIsImtleSIsImRlc2NyaXB0b3IiLCJmbiIsInZhbHVlIiwiYXJncyIsImluc3RhbmNlTnVtIiwidGltaW5nTmFtZSIsImNvbnN0cnVjdG9yIiwibmFtZSIsInNlbGYiLCJyZXRWYWwiLCJjb25zb2xlIiwidGltZSIsImFwcGx5IiwidGltZUVuZCIsImJpbmQiLCJjYWxsIiwiYXJndW1lbnRzIiwiZW5hYmxlIiwiZGlzYWJsZSIsInJlbGVhc2UiLCJkZWxldGUiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7QUFFQSxNQUFNQSxZQUFZLElBQUlDLE9BQUosRUFBbEI7QUFDQSxJQUFJQyxVQUFVLENBQWQ7O0FBRUEsU0FBU0MsUUFBVCxDQUFrQkMsUUFBbEIsRUFBNEI7QUFDMUIsUUFBTUMsT0FBTyxFQUFFQyxTQUFTLElBQVgsRUFBaUJDLE9BQU9MLFNBQXhCLEVBQWI7O0FBRUFGLFlBQVVRLEdBQVYsQ0FBY0osUUFBZCxFQUF3QkMsSUFBeEI7O0FBRUEsU0FBT0EsSUFBUDtBQUNEOztBQUVELFNBQVNJLFFBQVQsQ0FBa0JMLFFBQWxCLEVBQTRCO0FBQzFCLFNBQU8sQ0FBQ0osVUFBVVUsR0FBVixDQUFjTixRQUFkLEtBQTJCRCxTQUFTQyxRQUFULENBQTVCLEVBQWdERyxLQUF2RDtBQUNEOztBQUVELFNBQVNJLE1BQVQsQ0FBZ0JQLFFBQWhCLEVBQTBCRSxPQUExQixFQUFtQztBQUNqQyxHQUFDTixVQUFVVSxHQUFWLENBQWNOLFFBQWQsS0FBMkJELFNBQVNDLFFBQVQsQ0FBNUIsRUFBZ0RFLE9BQWhELEdBQTBEQSxPQUExRDtBQUNEOztBQUVELFNBQVNNLFNBQVQsQ0FBbUJSLFFBQW5CLEVBQTZCO0FBQzNCLFNBQU9KLFVBQVVhLEdBQVYsQ0FBY1QsUUFBZCxJQUEwQkosVUFBVVUsR0FBVixDQUFjTixRQUFkLEVBQXdCRSxPQUFsRCxHQUE0REgsU0FBU0MsUUFBVCxFQUFtQkUsT0FBdEY7QUFDRDs7QUFFRCxTQUFTUSxTQUFULENBQW1CQyxHQUFuQixFQUF3QjtBQUN0QixTQUFPLENBQUMsQ0FBQ0EsR0FBRixLQUFVLE9BQU9BLEdBQVAsS0FBZSxRQUFmLElBQTJCLE9BQU9BLEdBQVAsS0FBZSxVQUFwRCxLQUFtRSxPQUFPQSxJQUFJQyxJQUFYLEtBQW9CLFVBQTlGO0FBQ0Q7O0FBRURDLE9BQU9DLE9BQVAsR0FBaUIsVUFBU0MsTUFBVCxFQUFpQkMsR0FBakIsRUFBc0JDLFVBQXRCLEVBQWtDO0FBQ2pELFFBQU1DLEtBQUtELFdBQVdFLEtBQXRCOztBQUVBRixhQUFXRSxLQUFYLEdBQW1CLFVBQVMsR0FBR0MsSUFBWixFQUFrQjtBQUNuQyxRQUFJWixVQUFVLElBQVYsQ0FBSixFQUFxQjtBQUNuQixZQUFNYSxjQUFjaEIsU0FBUyxJQUFULENBQXBCO0FBQ0EsWUFBTWlCLGFBQWMsR0FBRSxLQUFLQyxXQUFMLENBQWlCQyxJQUFLLElBQUdILFdBQVksSUFBR0wsR0FBSSxFQUFsRTtBQUNBLFlBQU1TLE9BQU8sSUFBYjtBQUNBLFVBQUlDLFNBQVMsSUFBYjs7QUFFQUMsY0FBUUMsSUFBUixDQUFhTixVQUFiO0FBQ0FJLGVBQVNSLEdBQUdXLEtBQUgsQ0FBU0osSUFBVCxFQUFlTCxJQUFmLENBQVQ7O0FBRUEsVUFBSVYsVUFBVWdCLE1BQVYsQ0FBSixFQUF1QjtBQUNyQkEsZUFBT2QsSUFBUCxDQUFZZSxRQUFRRyxPQUFSLENBQWdCQyxJQUFoQixDQUFxQkosT0FBckIsRUFBOEJMLFVBQTlCLENBQVo7QUFDRCxPQUZELE1BRU87QUFDTEssZ0JBQVFHLE9BQVIsQ0FBZ0JSLFVBQWhCO0FBQ0Q7O0FBRUQsYUFBT0ksTUFBUDtBQUNELEtBaEJELE1BZ0JPO0FBQ0wsYUFBT1IsR0FBR2MsSUFBSCxDQUFRLElBQVIsRUFBY0MsU0FBZCxDQUFQO0FBQ0Q7QUFDRixHQXBCRDs7QUFzQkEsU0FBT2hCLFVBQVA7QUFDRCxDQTFCRDs7QUE0QkFKLE9BQU9DLE9BQVAsQ0FBZW9CLE1BQWYsR0FBd0IsVUFBU2xDLFFBQVQsRUFBbUI7QUFDekNPLFNBQU9QLFFBQVAsRUFBaUIsSUFBakI7O0FBRUEsU0FBTyxJQUFQO0FBQ0QsQ0FKRDs7QUFNQWEsT0FBT0MsT0FBUCxDQUFlcUIsT0FBZixHQUF5QixVQUFTbkMsUUFBVCxFQUFtQjtBQUMxQ08sU0FBT1AsUUFBUCxFQUFpQixLQUFqQjs7QUFFQSxTQUFPLElBQVA7QUFDRCxDQUpEOztBQU1BYSxPQUFPQyxPQUFQLENBQWVzQixPQUFmLEdBQXlCLFVBQVNwQyxRQUFULEVBQW1CO0FBQzFDSixZQUFVeUMsTUFBVixDQUFpQnJDLFFBQWpCOztBQUVBLFNBQU8sSUFBUDtBQUNELENBSkQiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAcHJvdmlkZXNNb2R1bGUgZGVjb3JhdG9ycy90aW1lclxuXG5jb25zdCBpbnN0YW5jZXMgPSBuZXcgV2Vha01hcCgpO1xubGV0IGNvdW50ZXIgPSAwO1xuXG5mdW5jdGlvbiBhZGRUb01hcChpbnN0YW5jZSkge1xuICBjb25zdCBpbnN0ID0geyBlbmFibGVkOiB0cnVlLCBpbmRleDogY291bnRlcisrIH07XG5cbiAgaW5zdGFuY2VzLnNldChpbnN0YW5jZSwgaW5zdCk7XG5cbiAgcmV0dXJuIGluc3Q7XG59XG5cbmZ1bmN0aW9uIGdldEluZGV4KGluc3RhbmNlKSB7XG4gIHJldHVybiAoaW5zdGFuY2VzLmdldChpbnN0YW5jZSkgfHwgYWRkVG9NYXAoaW5zdGFuY2UpKS5pbmRleDtcbn1cblxuZnVuY3Rpb24gdG9nZ2xlKGluc3RhbmNlLCBlbmFibGVkKSB7XG4gIChpbnN0YW5jZXMuZ2V0KGluc3RhbmNlKSB8fCBhZGRUb01hcChpbnN0YW5jZSkpLmVuYWJsZWQgPSBlbmFibGVkO1xufVxuXG5mdW5jdGlvbiBpc0VuYWJsZWQoaW5zdGFuY2UpIHtcbiAgcmV0dXJuIGluc3RhbmNlcy5oYXMoaW5zdGFuY2UpID8gaW5zdGFuY2VzLmdldChpbnN0YW5jZSkuZW5hYmxlZCA6IGFkZFRvTWFwKGluc3RhbmNlKS5lbmFibGVkO1xufVxuXG5mdW5jdGlvbiBpc1Byb21pc2Uob2JqKSB7XG4gIHJldHVybiAhIW9iaiAmJiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIG9iaiA9PT0gJ2Z1bmN0aW9uJykgJiYgdHlwZW9mIG9iai50aGVuID09PSAnZnVuY3Rpb24nO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSB7XG4gIGNvbnN0IGZuID0gZGVzY3JpcHRvci52YWx1ZTtcblxuICBkZXNjcmlwdG9yLnZhbHVlID0gZnVuY3Rpb24oLi4uYXJncykge1xuICAgIGlmIChpc0VuYWJsZWQodGhpcykpIHtcbiAgICAgIGNvbnN0IGluc3RhbmNlTnVtID0gZ2V0SW5kZXgodGhpcyk7XG4gICAgICBjb25zdCB0aW1pbmdOYW1lID0gYCR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSMke2luc3RhbmNlTnVtfS4ke2tleX1gO1xuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICBsZXQgcmV0VmFsID0gbnVsbDtcblxuICAgICAgY29uc29sZS50aW1lKHRpbWluZ05hbWUpO1xuICAgICAgcmV0VmFsID0gZm4uYXBwbHkoc2VsZiwgYXJncyk7XG5cbiAgICAgIGlmIChpc1Byb21pc2UocmV0VmFsKSkge1xuICAgICAgICByZXRWYWwudGhlbihjb25zb2xlLnRpbWVFbmQuYmluZChjb25zb2xlLCB0aW1pbmdOYW1lKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLnRpbWVFbmQodGltaW5nTmFtZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXRWYWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBkZXNjcmlwdG9yO1xufTtcblxubW9kdWxlLmV4cG9ydHMuZW5hYmxlID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdG9nZ2xlKGluc3RhbmNlLCB0cnVlKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzLmRpc2FibGUgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB0b2dnbGUoaW5zdGFuY2UsIGZhbHNlKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzLnJlbGVhc2UgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBpbnN0YW5jZXMuZGVsZXRlKGluc3RhbmNlKTtcblxuICByZXR1cm4gdGhpcztcbn07XG4iXX0=