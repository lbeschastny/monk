
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
 * Once method
 *
 * @api public
 */

Promise.prototype.once = EventEmitter.prototype.once;

/**
 * On method
 *
 * @api public
 */

Promise.prototype.on = function (event, callback) {
  if (event === 'success' || event === 'error' || event === 'complete') {
    return this[event](callback);
  } else {
    return MPromise.prototype.on.call(this, event, callback);
  }
};

/**
 * Each method
 *
 * @api public
 */

Promise.prototype.each = function (fn) {
  if (fn) {
    this.emitter.on('each', fn);
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
