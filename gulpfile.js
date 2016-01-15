'use strict';

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');

var browserSync = require('browser-sync').create();

var watchify = require('watchify');
var browserify = require('browserify');

var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');

var _ = require('lodash');




var customOpts = {
  entries: ['./src/main.js'],
  debug: true
};
var opts = _.assign({}, watchify.args, customOpts);


function gulpBundle(builder) {   
  return builder.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('build.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
     // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./dist'));
}


gulp.task('watch', function () {
  return gulpBundle(watchify(browserify(opts)));
});

gulp.task('build', function () {
  return gulpBundle(browserify(opts));
});

gulp.task('browser-sync', function () {
  return browserSync.init({
    server: true,
    files: 'dist/build.js',
    startPath: './dist/index.html'
  });
});

gulp.task('serve', ['watch', 'browser-sync']);

gulp.task('default', ['serve']);