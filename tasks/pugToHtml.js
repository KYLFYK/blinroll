const gulp = require('gulp')

const pug = require('gulp-pug')
const plumber = require('gulp-plumber')

module.exports = async function pugToHtml() {
    return gulp.src('src/pug/pages/*.pug')
        .pipe(plumber())
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest('dist'))
}