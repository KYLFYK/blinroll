const gulp = require('gulp')

const imagemin = require('gulp-imagemin')

module.exports = function imgMin() {
    return gulp.src('src/static/img/**.*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/img'))
}