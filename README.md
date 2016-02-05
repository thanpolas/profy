# Profy

Check the performance of your libraries by measuring memory consumption and time execution.

Profy is particularly useful when you stress test your application by looping. You add a Profy logger on each loop and in the end you get a meaningfull set of stats that you can assert on using your favorite testing suite.

## Getting Started

Install...

```shell
npm install profy --save-dev
```

Profy has no main file, depending on what you want to measure you require the corresponding module.

## Time Performance

The time performance API is pretty simple, use the `start` function to start measuring, `log` to mark a point and `result` when finished to get the results.

### Requiring

```js
var ProfyTime = require('profy/time');
```

### Methods

Requiring will return you a constructor. You need to initialize a new performance timer using the `new` keyword:

```js
var ProfyTime = require('profy/time');

var perf = new ProfyTime();
```

### Method `start()`

Will mark the beggining of the performance test.

### Method `log(optMessage)`

Will mark a point in time, optionally with a defined message. You can view the marks you made along with their messages when the perf tests finishes.

`log()` will return a number, indicating the `index` of the log message, which you can later use as an argument to the `get(index)` method.

### Method `stop()` or `results()`

`stop()` and `results()` are aliases. They mark the end of the perfomance test and calculate all the required statistics. They both return the Performance Results Object:

#### The Performance Results Object

```js

var results = perf.results();

results === {
  stats: {
    max: 2.779, // {number} Float, milliseconds, largest difference
    min: 0.008, // {number} Float, milliseconds, smallest difference
    mean: 0.258, // {number} Float, milliseconds, mean difference
    total: 5.668 // {number} Float, milliseconds, total execution time
  },
  
  // {number}, JS timestamp when ".start()" was invoked.
  firstLog: 1367251825022454,

  // {number}, JS timestamp when ".stop()" or ".results()"
  // was first invoked.
  lastLog: 1367251825028122,

  // "logs" is an array of JS timestamps, every time .log() 
  // is invoked a timestamp is being pushed to this array.
  logs: [1367251825022457, 1367251825022561 /* ... */ ],

  // "diffs" is an array of time differences in microseconds 
  // (1ms === 1000microsecond). 
  // This array is one-for-one with the "logs" array.
  diffs: [204, 104, 1269 /* ... */],

  // "tags" is array of strings, the messages that were provided when
  // invoking the ".log(message)" method. This array is one-for-one
  // with the "logs" array.
  tags: ['log 1', 'log 2' /* ... */]

};

```

### Method `get(index)`

After `stop()` or `results()` have been invoked, a specific index from the logs can be requested using the `get(index)` method. Use as `index` the value returned by the `log()` method.

```js

perf.start();

// get the index of the log mark (first one will be 0).
var index = perf.log('log one');

/* ... */

perf.log('log ten');

perf.stop();

var itemResult = perf.get(index);

itemResult === {
  time: 1367251825024312, // {number}, JS Timestamp of log
  diff: 104, // {number}, difference from previous log in microseconds
  tag: 'log one' // {string | null}, the log message used in log()
}
```

### Method `resultTable()`

Returns a string with the results somewhat formated, use for console output when debugging.

### Examples

```js
var ProfyTime = require('profy/time');

var perf = new ProfyTime();

perf.start();

for (var i = 0; i < 10000; i++) {
  app.doSomething();
  perf.log(i);
}

console.log( perf.result() );
```



## Memory Consumption

Memory consumption is measured by reading the value of the `process.memoryUsage().heapUsed` property. An initial measurement is taken and from there on every `log()` performed will log the value of that property.

### Requiring

```js
var ProfyMem = require('profy/mem');
```

### Methods

Requiring will return you a constructor. You need to initialize a new Memory Consumption instance using the `new` keyword:

```js
var ProfyMem = require('profy/mem');

var mem = new ProfyMem();
```

### Method `start()`

Will mark the beggining of the measurement.

### Method `log(optMessage)`

Will take a measurement., optionally with a defined message. You can view the marks you made along with their messages when the memory perf tests finishes.

`log()` will return a number, indicating the `index` of the log message, which you can later use as an argument to the `get(index)` method.

### Method `stop()` or `results()`

`stop()` and `results()` are aliases. They mark the end of the perfomance test and calculate all the required statistics. They both return the Memory Results Object:

#### The Memory Results Object

```js

var results = mem.results();

results === {
  stats: {
    max: 5134336, // {number} bytes, max bytes difference measured.
    min: 489832, // {number} bytes, min bytes difference measured.
    mean: 2597880 // {number} bytes, mean bytes difference.
  },
  percent: {
    max: 145.46, // {number} float, max in % compared to start
    min: 13.88,  // {number} float, min in % compared to start
    mean: 73.6,  // {number} float, mean in % compared to start
    last: 145.46 // {number} float, last in % compared to start
  }
  
  // {number} bytes used when start() was invoked.
  firstHeap: 3529800,

  // {number} bytes used when stop() was invoked.
  lastHeap: 5134336,
  
  // "heaps" is an array of bytes used when .log() is invoked.
  heaps: [4019632, 4735312 /* ... */ ],

  // "percentItems" is an array of floats, representing the %
  // difference with the first heap measurement.
  // This array is one-for-one with the "heaps" array.
  percentItems: [13.88, 34.15 /* ... */ ],

  // "tags" is array of strings, the messages that were provided when
  // invoking the ".log(message)" method. This array is one-for-one
  // with the "heaps" array.
  tags: ['log 1', 'log 2' /* ... */]

};

```

### Method `get(index)`

After `stop()` or `results()` have been invoked, a specific index from the logs can be requested using the `get(index)` method. Use as `index` the value returned by the `log()` method.

```js

mem.start();

// get the index of the log mark (first one will be 0).
var index = mem.log('log one');

/* ... */

mem.log('log ten');

mem.stop();

var itemResult = mem.get(index);

itemResult === {
  heap: 6077936, // {number}, bytes used
  percent: 108.5, // {number}, float, % difference from first heap
  tag: 'log one' // {string | null}, the log message used in log()
}
```

### Method `resultTable()`

Returns a string with the results somewhat formated, use for console output when debugging.

### Examples

```js
var ProfyMem = require('profy/mem');

var mem = new ProfyMem();

mem.start();

for (var i = 0; i < 10000; i++) {
  app.doSomething();
  mem.log(i);
}

console.log( mem.result() );
```

## Release History
- **v1.0.0**, *05 Feb 2016*
  - Upgraded all packages to latest.
- **v0.1.1**, *21 Apr 2015*
  - Removed `memwatch` package, wasn't being used anyway.
- **v0.1.0**, *21 Apr 2015*
  - Node v0.12.x compatible, upgraded all deps to latest.
- **v0.0.5**, *29 Apr 2013*
  - API cleanup, documentation
  - Bug fixes
- **v0.0.1**, *Mid Apr 2013*
  - Big Bang

## License
Copyright (c) 2013 Thanasis Polychronakis
Licensed under the [MIT](LICENSE-MIT).

<sup>[↑ Back to TOC](#table-of-contents)</sup>

[closure-library]: https://developers.google.com/closure/library/ "Google Closure Library"
[closure-tools]: https://developers.google.com/closure/ "Google Closure Tools"
[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/wiki/Getting-started
[package.json]: https://npmjs.org/doc/json.html
[Gruntfile]: https://github.com/gruntjs/grunt/wiki/Sample-Gruntfile "Grunt's Gruntfile.js"
[yeoman]: http://yeoman.io/ "yeoman Modern Workflows for Modern Webapps"
