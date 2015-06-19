
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');

var PATHS = require('../config/paths');
module.exports = function () {
  browserify(PATHS.ENTRY_POINT_PATH, {
    standalone: 'oath'
  }).transform(
    'babelify'
  ).bundle().pipe(
    source(PATHS.OUTPUT_FILE_NAME)
  ).pipe(
    gulp.dest(PATHS.OUTPUT_DIR)
  );
};
