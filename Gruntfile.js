/*jshint camelcase:false */
// Generated on 2013-04-14 using generator-closure 0.1.2

module.exports = function (grunt) {

  //
  //
  // Start Gruntconfig
  //
  //
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    watch: {
      test: {
        files: [
          'test/**/*.js'
        ],
        tasks: ['']
      }
    },
    // clean, uglify and concat aid in building
    clean: {
      dist: ['temp'],
      server: 'temp'
    }
  });



  grunt.registerTask('test', []);


  grunt.registerTask('default', [
    'test'
  ]);
};
