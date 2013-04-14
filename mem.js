
  // process.memoryUsage()
  // { rss:       13488128,
  //   heapTotal:  6131200,
  //   heapUsed:   2739720
  // }
  //

var Mem = module.exports = function() {
  this.heapStart = null;
  this.heaps = [];
};

Mem.prototype._getMem = function() {
  return process.memoryUsage().heapUsed;
};

Mem.prototype.start = function() {
  this.heapStart = this._getMem();
};

Mem.prototype.log = function() {
  this.heaps.push(this._getMem());
};

Mem.prototype._getPercent = function(whole, fragment) {
  return this._round(fragment / whole);
};

Mem.prototype._round = function(num) {
  return Math.round(num * 100) / 100;
};

Mem.prototype.result = function() {

  var max = 0;
  var min = 0;
  var curs = [];
  var cur = 0;
  this.heaps.forEach(function(heapUsed) {
    cur = this._getPercent(this.heapStart, heapUsed);
    max = (cur > max ? cur : max);
    min = (cur < min ? cur : min);
    curs.push(cur);
  }, this);

  var totalLogs = this.heaps.length;
  var mean = curs.reduce(function(a, b){return a+b;}) / totalLogs;
  mean = this._round(mean);
  var last = this._getPercent(this.heapStart, this.heaps[totalLogs - 1]);

  return {
    stats: {
      max: max,
      min: min,
      mean: mean,
      last: last
    },
    heaps: this.heaps,
    firstHeap: this.heapStart
  };

};

