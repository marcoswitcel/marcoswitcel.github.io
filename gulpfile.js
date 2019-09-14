var gulp = require('gulp');
var jsImport = require('gulp-js-import');

//node ./node_modules/gulp/bin/gulp.js
gulp.task('default', function() {
    
    return gulp.src('./src/index.js')
        .pipe(jsImport({hideConsole: true}))
        .pipe(gulp.dest('./public/'));
});

// gulp.task('watch', function() {
//     gulp.watch(['./src/**/*.js'], ['importJS']);
// });

// gulp.task('default', ['importJS', 'watch']);