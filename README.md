# Profy

Check the performance of your libraries by measuring memory consumption and time execution.

Profy is particularly useful when you stress test your application by looping. You add a Profy logger on each loop and in the end you get a meaningfull set of stats that you can assert on using your favorite testing suite.

## Getting Started

Install...

```shell
npm install profy --save-dev
```

Profy has no main file, depending on what you want to measure you require the corresponding module.

## Timing Execution

The timing API is pretty simple, use the `start` function to start measuring, `log` to mark a point and `result` when finished to get the results.

Example:

```js
var ptime = require('profy/time');

ptime.start();

for (var i = 0; i < 10000; i++) {
  app.doSomething();
  ptime.log(i);
}

console.log( ptime.result() );
```

### Timing :: `start()`

Start measuring time.

### Timing :: `log(optMessage)`

Mark a point in time, optionally with a message.

### Timing :: `result()`

Result will mark the ending of the test and crunch the collected data. It will return an Object that contains the following keys:

* 

## Memory Consumption

```js
var pmem = require('profy/mem');

pmem.start();

for (var i = 0; i < 10000; i++) {
  app.doSomething();
  pmem.log(i);
}

console.log( pmem.result() );
```

## Table Of Contents

* [Getting Started](#getting-started)
* About
  - [Release History](#release-history)
  - [License](#license)





<sup>[↑ Back to TOC](#table-of-contents)</sup>

## Release History
- **v0.0.1**, *Mid Apr 2013*
  - Big Bang

## License
Copyright (c) 2013 ME PRETTY
Licensed under the [MIT](LICENSE-MIT).

<sup>[↑ Back to TOC](#table-of-contents)</sup>

[closure-library]: https://developers.google.com/closure/library/ "Google Closure Library"
[closure-tools]: https://developers.google.com/closure/ "Google Closure Tools"
[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/wiki/Getting-started
[package.json]: https://npmjs.org/doc/json.html
[Gruntfile]: https://github.com/gruntjs/grunt/wiki/Sample-Gruntfile "Grunt's Gruntfile.js"
[yeoman]: http://yeoman.io/ "yeoman Modern Workflows for Modern Webapps"
