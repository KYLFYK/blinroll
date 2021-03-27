const gulp = require('gulp')

const pugToHtml = require('./tasks/pugToHtml')
const styles = require('./tasks/style')
const script = require('./tasks/script')
const imgMin = require('./tasks/imgMin')
const serve = require('./tasks/serve')
const ico = require('./tasks/ico')

module.exports.default = gulp.parallel(pugToHtml, styles, script, imgMin, ico, serve)