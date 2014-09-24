
/**
 * Module dependencies.
 */

var MPromise = require('mpromise');
var EventEmitter = require('events').EventEmitter;

/**
 * Module exports.
 */

module.exports = Promise;

/**
 * Promise constructor.
 *
 * @param {Collection} collection
 * @param {String} type
 * @param {Object} query options
 * @api public
 */

function Promise (col, type, opts) {
  this.col = col;
  this.type = type;
  this.opts = opts || {};

  // MPromise constructor
  MPromise.call(this);

  // Compability methods
  this.success = this.onFulfill;
  this.error = this.onReject;
  this.complete = this.onResolve;

  // Compability events
  var emitter = this.emitter;
  function emit (type) {
    return function listener (a, b) {
      if (emitter.listeners(type).length > 0) {
        var args = [].slice.call(arguments);
        emitter.emit.apply(emitter, [type].concat(args));
      }
    };
  }
  this.onFulfill(emit('success'));
  this.onReject(emit('error'));
  this.onResolve(emit('complete'));

  // for practical purposes
  this.resolve = MPromise.prototype.resolve.bind(this);
  this.fulfill = MPromise.prototype.fulfill.bind(this);
  this.reject = MPromise.prototype.reject.bind(this);
}

/**
 * Inherits from MPromise.
 */

Promise.prototype.__proto__ = MPromise.prototype;

/**
 * Inherits from EventEmitter.
 */

Promise.prototype.once = EventEmitter.prototype.once;

/**
 * Each method
 *
 * @api public
 */

Promise.prototype.each = function (fn) {
  if (fn) {
    this.on('each', fn);
  }
  return this;
};

/**
 * Destroys the promise.
 *
 * @api public
 */

Promise.prototype.destroy = function(){
  this.emitter.emit('destroy');
  var self = this;
  process.nextTick(function(){
    // null the query ref
    delete self.query;
  });
};
