import * as gulp from 'gulp';
import * as path from 'path';
import * as typescript from 'gulp-tsc';
import * as inject from 'gulp-inject-string';
import * as replace from 'gulp-replace';

gulp.task('build.electron', () => {
    // console.log(path.join(process.cwd(), 'dist', 'index.html'));

    return gulp.src(['src/electron/**/*.ts'])
        .pipe(typescript())
        .pipe(gulp.dest('dist/'))
        .pipe(gulp.src(path.join(process.cwd(), 'dist', 'index.html'))
            .pipe(replace("<script type='text/javascript'>window.electron = require('electron');</script>", '', { logs: { enabled: true }}))
            .pipe(inject.before('</body>',"<script type='text/javascript'>window.electron = require('electron');</script>")))
        .pipe(gulp.dest('dist/'));
});