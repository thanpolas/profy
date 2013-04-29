
  // process.memoryUsage()
  // { rss:       13488128,
  //   heapTotal:  6131200,
  //   heapUsed:   2739720
  // }
  //

var memwatch = require('memwatch');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

/**
 * The Mem consumption class
 *
 * @constructor
 * @extends {events.EventEmitter}
 */
var Mem = module.exports = function() {
  EventEmitter.call(this);

  this.heapStart = null;
  this.heaps = [];
  this.tags = [];

  this.heapDiffer =  null;
  this._finished = false;
  this._result = null;

  this.gcCount = 0;

  // how many GC cycles to wait before trigerring finish
  this.gcTimes = 2;
};
util.inherits(Mem, EventEmitter);

Mem.prototype._getMem = function() {
  return process.memoryUsage().heapUsed;
};

Mem.prototype.start = function() {
  if (this.heapStart) {
    throw new Error('Memory track already started');
  }
  this.heapStart = this._getMem();
  // this.heapDiffer = new memwatch.HeapDiff();
  // memwatch.on('stats', this._onMemStats.bind(this));
};

Mem.prototype._onMemStats = function checkMemory(info) {
  this.gcCount++;

  // console.log('GC Count: ', this.gcCount, 'Info:\n', util.inspect(info, true, null));

  if ( this.gcTimes > this.gcCount) {
    return;
  }
  var diff = this.heapDiffer.end();
  memwatch.removeListener('stats', this._onMemStats.bind(this));


  // console.log('Before heap info');
  // console.log(util.inspect(diff.before, true, null));

  // console.log('After heap info');
  // console.log(util.inspect(diff.after, true, null));

  // console.log('Heap changes');
  // console.log(util.inspect(diff.change, true, null));

  this.emit('finish');
};

/**
 * Take a mem snapshot measurement and store it, optionally with a message
 *
 * @param  {string=} optsTag message.
 * @return {number} the log index.
 */
Mem.prototype.log = function(optsTag) {
  if (this._finished) {
    throw new Error('Memory track has finished');
  }
  this.heaps.push(this._getMem());
  var tag = ('undefined' === typeof optsTag ? '' : optsTag);
  this.tags.push(tag);

  return this.heaps.length - 1;
};


/**
 * Get a single timing record.
 * @param  {number} index the index.
 * @return {Object} the object.
 */
Mem.prototype.get = function(index) {
  if (!this._finished) {
    throw new Error('Memory not finished');
  }

  var res = {
    heap: this.heaps[index],
    percent: this._result.percentItems[index],
    tag: this.tags[index]
  };

  return res;

};


Mem.prototype._getPercent = function(whole, fragment) {
  return this._round( ((fragment / whole) - 1) * 100);
};

Mem.prototype._round = function(num) {
  return Math.round(num * 100) / 100;
};

Mem.prototype.result = function() {
  if (this._finished) {
    return this._result;
  }
  this._finished = true;

  var heapsCopy = Array.prototype.slice.call(this.heaps, 0);
  heapsCopy.sort();
  var max = heapsCopy[heapsCopy.length - 1];
  var min = heapsCopy[0];

  var maxPercent = this._getPercent(this.heapStart, max);
  var minPercent = this._getPercent(this.heapStart, min);
  var percentItems = [];
  var curPercent = 0;

  this.heaps.forEach(function(heapUsed) {
    curPercent = this._getPercent(this.heapStart, heapUsed);
    percentItems.push(curPercent);
  }, this);

  var totalLogs = this.heaps.length;

  var mean = Math.floor(this.heaps.reduce(function(a,b){return a+b;}) / totalLogs);

  var meanPercent = percentItems.reduce(function(a, b){return a+b;}) / totalLogs;
  meanPercent = this._round(meanPercent);
  var lastPercent = this._getPercent(this.heapStart, this.heaps[totalLogs - 1]);

  this._result = {
    stats: {
      max: max - this.heapStart,
      min: min - this.heapStart,
      mean: mean - this.heapStart
    },
    percent: {
      max: maxPercent,
      min: minPercent,
      mean: meanPercent,
      last: lastPercent
    },
    lastHeap: this.heaps[this.heaps.length - 1] - this.heapStart,
    firstHeap: this.heapStart,
    heaps: this.heaps,
    percentItems: percentItems,
    tags: this.tags
  };

  return this._result;

};

/**
 * Alias for the result method
 * @return {Object}
 */
Mem.prototype.stop = Mem.prototype.result;


/**
 * Return a fancy table in plain text.
 * @return {string} perfomance stats.
 */
Mem.prototype.resultTable = function(optCsv) {
  if (!this._finished) {
    throw new Error('Not finished. Invoke "stop()" or "results()" to finish.');
  }
  var out = '';

  this.heaps.forEach(function(heap, index) {
    if (optCsv) {
      out += index + ',' + this.heaps[index];
      out += ',' + (this.heaps[index] - this.heapStart);
      out += ',' + this._result.percentItems[index] + '%';
      out += ',' + this.tags[index] + '\n';

    } else {
      out += index + '. ' + this.heaps[index];
      out += ' [' + (this.heaps[index] - this.heapStart) + ']';
      out += ' ( ' + this._result.percentItems[index] + '% )';
      out += ' ' + this.tags[index] + '\n';
    }
  }, this);

  return out;
};
