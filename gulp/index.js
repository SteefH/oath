var gulp = require('gulp');

module.exports = function(tasks) {
  tasks.forEach(function (taskName) {
    gulp.task(taskName, require('./tasks/' + taskName));
  });
  return gulp;
}
