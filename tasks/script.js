const gulp = require('gulp')
const babel = require('gulp-babel')
const terser = require('gulp-terser')

module.exports = async function script(cb) {
    gulp.src('src/static/js/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(terser())
        .pipe(gulp.dest('dist/js'))
    return cb()
}
