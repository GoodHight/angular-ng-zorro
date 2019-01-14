"use strict";
exports.__esModule = true;
var gulp = require("gulp");
var path = require("path");
var typescript = require("gulp-tsc");
var inject = require("gulp-inject-string");
var replace = require("gulp-replace");
gulp.task('build.electron', function () {
    // console.log(path.join(process.cwd(), 'dist', 'index.html'));
    return gulp.src(['src/electron/**/*.ts'])
        .pipe(typescript())
        .pipe(gulp.dest('dist/'))
        .pipe(gulp.src(path.join(process.cwd(), 'dist', 'index.html'))
        .pipe(replace("<script type='text/javascript'>window.electron = require('electron');</script>", '', { logs: { enabled: true } }))
        .pipe(inject.before('</body>', "<script type='text/javascript'>window.electron = require('electron');</script>")))
        .pipe(gulp.dest('dist/'));
});
