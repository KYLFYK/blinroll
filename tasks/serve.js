const gulp = require('gulp')

const pugToHtml = require('./pugToHtml')
const styles = require('./style')
const script = require('./script')
const imgMin = require('./imgMin')
const ico = require('./ico')
const audio = require('./audio')

const server = require('browser-sync').create()

module.exports = function serve(cb) {
    server.init({
        server: 'dist',
        notify: false,
        open: true,
        cors: true
    })

    gulp.watch('src/static/img', gulp.series(imgMin)).on('change', server.reload)
    gulp.watch('src/static/scss/*.scss', gulp.series(styles)).on('change', server.reload)
    gulp.watch('src/static/js/*.js', gulp.series(script)).on('change', server.reload)
    gulp.watch('src/pug/**/*.pug', gulp.series(pugToHtml)).on('change', server.reload)
    gulp.watch('src/static/ico/**.*', gulp.series(ico)).on('change', server.reload)
    gulp.watch('dist/*.html').on('change', server.reload)
    gulp.watch('dist/js/*.js').on('change', server.reload)
    gulp.watch('src/static/audio/**.*', gulp.series(audio)).on('change', server.reload)

    return cb()
}