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

/**
 * Create a log in time, optionally with a message
 *
 * @param  {string=} optsTag message.
 * @return {number} the log index.
 */
Timing.prototype.log = function(optsTag) {
  if (this.finished) {
    throw new Error('Timer has finished');
  }
  this.logs.push(this.t.get());
  var tag = ('undefined' === typeof optsTag ? '' : optsTag);
  this.tags.push(tag);

  return this.logs.length - 1;
};

/**
 * Get a single timing record.
 * @param  {number} index the index.
 * @return {Object} the object.
 */
Timing.prototype.get = function(index) {
  if (!this.finished) {
    throw new Error('Timer not finished');
  }

  var res = {
    time: this.logs[index],
    diff: this._result.diffs[index],
    tag: this.tags[index]
  };

  return res;

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
  var min = 999999;
  var diffs = [];
  this.logs.forEach(function(stamp, index) {
    // console.log('stamp:', stamp, index, !_.isNumber(this.logs[index - 1]), stamp - this.logs[index - 1], this.tags[index]);
    var diff;
    if (!this.logs[index - 1]) {
      // first log record
      diff = this.startTime - stamp;
    } else {
      diff = stamp - this.logs[index - 1];
    }

    diffs.push(diff);
    var diffMs = diff / 1000;
    max = (diffMs > max ? diffMs : max);
    min = (diffMs < min ? diffMs : min);
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
 *
 * @param {string|Regex=} optFilt filter messages.
 * @return {string} perfomance stats.
 */
Timing.prototype.resultTable = function(optFilt) {
  if (!this.finished) {
    throw new Error('Not finished. Invoke "stop()" or "results()" to finish.');
  }
  var out = '';

  this.logs.forEach(function(logStamp, index) {
    if (optFilt) {
      try {
        if (!this.tags[index].match(optFilt)) {
          return;
        }
      } catch(ex) {
        return;
      }
    }
    out += index + '. ' + this.logs[index];
    out += ' [' + (this._result.diffs[index] / 1000) + ' ms] ';
    out += this.tags[index] + (optFilt ? '' : '\n');
  }, this);

  return out;

};

