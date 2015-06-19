var PATHS = require('../config/paths');
var karma = require('karma').server;

module.exports = function(done) {
  karma.start({
    configFile: PATHS.PROJECT_DIR + 'karma.conf.js'
  }, done);
};
