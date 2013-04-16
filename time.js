var microtime = require('microtime');

/**
 * @fileoverview the timing module.
 */
var Timing = module.exports = function() {
  this.startTime = null;
  this.t = {
    get: function() {
      return microtime.now();
    }
  };
  this.logs = [];
  this.tags = [];

  this.finished = false;
  this._result = null;
};

var _singleton;
Timing.getSingleton = function() {
  if (_singleton) {
    return _singleton;
  }

  return (_singleton = new Timing());
};

Timing.prototype.start = function() {
  if (this.startTime) {
    throw new Error('Timer already started');
  }
  this.startTime = this.t.get();
};

Timing.prototype.log = function(optsTag) {
  if (this.finished) {
    throw new Error('Timer has finished');
  }
  this.logs.push(this.t.get());
  var tag = ('undefined' === typeof optsTag ? '' : optsTag);
  this.tags.push(tag);
};


Timing.prototype._getPercent = function(whole, fragment) {
  return this._round(fragment / whole);
};

Timing.prototype._round = function(num) {
  return Math.round(num) / 1000;
};

Timing.prototype.result = function() {
  if (this.finished) {
    return this._result;
  }
  this.finished = true;

  var max = 0;
  var min = 0;
  var diffs = [];
  this.logs.forEach(function(stamp, index) {
    // console.log('stamp:', stamp, index, !_.isNumber(this.logs[index - 1]), stamp - this.logs[index - 1], this.tags[index]);
    if (!this.logs[index - 1]) {
      diffs.push(NaN);
      return;
    }
    var diff = stamp - this.logs[index - 1];
    diffs.push(diff);
    max = (diff > max ? diff : max) / 1000;
    min = (diff < min ? diff : min) / 1000;
  }, this);

  var totalLogs = this.logs.length;
  var mean = NaN;
  if ( 2 < diffs.length) {
    // eject the first record (NaN)
    var diffCopy = Array.prototype.slice.call(diffs, 1);
    mean = diffCopy.reduce(function(a, b){return a+b;}) / ( totalLogs - 1 );
    mean = this._round(mean);
  }

  var total = this.logs[totalLogs - 1] - this.startTime;

  this._result = {
    stats: {
      max: max,
      min: min,
      mean: mean,
      total: total / 1000
    },
    logs: this.logs,
    tags: this.tags,
    diffs: diffs,
    firstLog: this.startTime,
    lastLog: this.logs[totalLogs - 1]
  };

  return this._result;
};

/**
 * Alias for the result method
 * @return {Object}
 */
Timing.prototype.stop = Timing.prototype.result;


/**
 * Return a fancy table in plain text.
 * @return {string} perfomance stats.
 */
Timing.prototype.resultTable = function() {
  if (!this.finished) {
    throw new Error('Not finished. Invoke "stop()" or "results()" to finish.');
  }
  var out = '';

  this.logs.forEach(function(logStamp, index) {
    out += index + '. ' + this.logs[index];
    out += ' [' + (this._result.diffs[index] / 1000) + ' ms] ';
    out += this.tags[index] + '\n';
  }, this);

  return out;

};

