module.exports = function(grunt) {
  'use strict';
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    livereload: {
      port: 9999
    },
    express: {
      all: {
        options: {
          bases: ['./'],
          port: 8888,
          hostname: '0.0.0.0',
          livereload: {
            port: 9999
          }
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'examples/*.js' ],
      options: {
        jshintrc: true
      }
    },
    watch: {
      files:  ['<%= jshint.files %>'],
      tasks: ['jshint', 'concat', 'uglify'],
      options: {
        interval: 5007,
        livereload: true
      }
    },
    open: {
      all: {
        path: 'http://localhost:8080/examples/index.html'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-livereload');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('default', [
    'express',
    'open',
    'watch',
  ]);

  grunt.registerTask('build', [
    'jshint',
    'concat',
    'uglify'
  ]);
  grunt.registerTask('lint', ['jshint']);
};