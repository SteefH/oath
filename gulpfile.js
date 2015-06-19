var gulp = require('./gulp')([
  'browserify',
  'test',
  'dev'
]);

gulp.task('build', ['browserify']);
gulp.task('default', ['build']);
