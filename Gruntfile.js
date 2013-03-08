module.exports = function( grunt ) {
  'use strict';
  //
  // Grunt configuration:
  //
  // https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
  //
  grunt.initConfig({

    // Project configuration
    // ---------------------

    // generate application cache manifest
    manifest:{
      dest: ''
    },

    // headless testing through PhantomJS
    mocha: {
      all: ['test/**/*.html']
    },



    // Build configuration
    // -------------------

    // the staging directory used during the process
    staging: 'temp',
    // final build output
    output: 'dist',

    concat: {
      dist: {
        src: ['app/scripts/vendor/**/*.js'],
        dest: 'dist/vendor.js'
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/vendor.min.js': [
            'app/scripts/vendor/jquery-1.8.3.js',
            'app/scripts/vendor/jquerypp.js',
            'app/scripts/vendor/jquery-ui-1.9.2.custom.js',
            'app/scripts/vendor/jquery.ui.touch-punch.js',
            'app/scripts/vendor/jstree.js',
            'app/scripts/vendor/globalize.js',
            'app/scripts/vendor/cultures/globalize.cultures.js',
            'app/scripts/vendor/leaflet.js',
            'app/scripts/vendor/leaflet.markercluster-src.js',
            'app/scripts/vendor/leaflet.draw.js',
            'app/scripts/vendor/leaflet.google.js',
            'app/scripts/vendor/Control.FullScreen.js',
            'app/scripts/vendor/proj4js-combined.js',
            'app/scripts/vendor/tile.stamen.js',
            'app/scripts/vendor/r2d3.v2.js',
            'app/scripts/vendor/d3.v2.js',
            'app/scripts/vendor/rickshaw.min.js',
            'app/scripts/vendor/crossfilter.js',
            'app/scripts/vendor/dc.min.js',
            'app/scripts/vendor/highcharts.js',
            'app/scripts/vendor/raphael.js',
            'app/scripts/vendor/justgage.1.0.1.js',
            'app/scripts/vendor/gauge.min.js',
            'app/scripts/vendor/keymaster.min.js',
            'app/scripts/vendor/augment.min.js',
            'app/scripts/vendor/lunr.js',
            'app/scripts/vendor/Three.js',
            'app/scripts/vendor/heyoffline.js',
            'app/scripts/vendor/async.min.js',
            'app/scripts/vendor/json2.js',
            'app/scripts/vendor/underscore.js',
            'app/scripts/vendor/jquery.gridster.js',
            'app/scripts/vendor/viewport.js',
            'app/scripts/vendor/backbone-0.9.10.js',
            'app/scripts/vendor/backbone-associations-min.js',
            'app/scripts/vendor/backbone.fetch-cache.js',
            'app/scripts/vendor/backbone.babysitter.js',
            'app/scripts/vendor/backbone-localstorage.js',
            'app/scripts/vendor/backbone.marionette.min.js',
            'app/scripts/vendor/backbone.modelbinder.js',
            'app/scripts/vendor/backbone.collectionbinder.js',
            'app/scripts/vendor/visualsearch.js',
            'app/scripts/vendor/bootstrap.js',
            'app/scripts/vendor/fuelux/loader.js',
            'app/scripts/vendor/bootstrap-notify.js'
          ]
        }
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Alias the `test` task to run the `mocha` task instead
  grunt.registerTask('test', 'server:phantom mocha');
  grunt.registerTask('default', ['uglify']);

};
