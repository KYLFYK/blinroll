const gulp = require('gulp')

const gulpSass = require('gulp-sass')
const autoprefix = require('gulp-autoprefixer')
const plumber = require('gulp-plumber')

module.exports = async function styles() {
    return gulp.src('src/static/scss/*.scss')
        .pipe(plumber())
        .pipe(gulpSass())
        .pipe(autoprefix({
            overrideBrowserslist: ['last 4 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/css'))
}