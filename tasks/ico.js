const gulp = require('gulp')

module.exports = function ico() {
    return gulp.src('src/static/ico/**.*')
        .pipe(gulp.dest('dist/ico'))
}