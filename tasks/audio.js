const gulp = require('gulp')

module.exports = function audio() {
    return gulp.src('src/static/audio/**.*')
        .pipe(gulp.dest('dist/audio'))
}