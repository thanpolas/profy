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
    release: {
      options: {
        bump: true, //default: true
        file: 'package.json', //default: package.json
        add: true, //default: true
        commit: true, //default: true
        tag: true, //default: true
        push: true, //default: true
        pushTags: true, //default: true
        npm: true, //default: true
        tagName: 'v<%= version %>', //default: '<%= version %>'
        commitMessage: 'releasing v<%= version %>', //default: 'release <%= version %>'
        tagMessage: 'v<%= version %>' //default: 'Version <%= version %>'
      }
    }

  });



  grunt.registerTask('test', []);


  grunt.registerTask('default', [
    'test'
  ]);
};
