module.exports = function(grunt) {
  'use strict';
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    livereload: {

    },
    express: {
      all: {
        options: {
          bases: ['./'],
          port: 8080,
          hostname: '0.0.0.0',
          livereload: true
        }
      }
    },
    watch: {
      all: {
        files: '**/*.html',
        options: {
          livereload: true
        }
      }
    },
    open: {
      all: {
        path: 'http://localhost:8080/examples/index.html'
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js', 'examples/*.js' ],
      options: {
        jshintrc: true
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
    'jshint',
    'open',
    'watch'
  ]);

  grunt.registerTask('lint', ['jshint']);
};