var PROJECT_DIR      = __dirname + '/../',
    SRC_DIR          = PROJECT_DIR + 'src/',

    ENTRY_POINT_FILE = 'oath.js',
    ENTRY_POINT_PATH = SRC_DIR + ENTRY_POINT_FILE,
    OUTPUT_DIR       = PROJECT_DIR + 'dist/',
    OUTPUT_FILE_NAME = 'oath.js',
    OUTPUT_PATH      = OUTPUT_DIR + OUTPUT_FILE_NAME;


var browserify = require('browserify');
var fs = require('fs');
fs.mkdirSync(OUTPUT_DIR);
browserify(ENTRY_POINT_PATH, {
  standalone: 'oath'
}).transform(
  'babelify'
).bundle().pipe(
  fs.openSync(OUTPUT_PATH, 'w')
);
