var gulp = require('gulp');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var flatten = require('gulp-flatten');
var webserver = require('gulp-webserver');
var minify = require('gulp-minify');

/* Move index.html and templates */
gulp.task('moveHTML', function(){
    gulp.src(['./src/index.html'])
        .pipe(gulp.dest('./dist'))
        .pipe(notify('Moved index.html'));

    gulp.src(['!./src/index.html', './src/**/*.html'])
        .pipe(flatten())
        .pipe(gulp.dest('./dist/templates'))
        .pipe(notify('Moved templates'));
});

 /*	Concatenating, moving and minifying all scripts */
gulp.task('scripts', function() {
    gulp.src(['./src/app.js', './src/**/*.js'])
        .pipe(concat('all.js'))
        .pipe(minify())
        .pipe(gulp.dest('./dist/js'))
        .pipe(notify('Concatenate scripts in all.js'));
});

/* Move CSS */
gulp.task('moveCSS', function(){
    gulp.src(['./src/assets/animate.min.css', './src/main.css', './src/**/*.css'])
        .pipe(concat('main-style.css'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(notify('Moved and minified css'));
});

gulp.task('serve', function(){
    gulp.src('.')
        .pipe(webserver({
            port: 48081,
            livereload: true,
            open: 'http://localhost:48081/dist'
    })).pipe(notify("Running webserver!"));
});

gulp.task('watch', ['serve'], function () {
    gulp.start(['moveHTML', 'scripts', 'moveCSS']);
    gulp.watch(['src/index.html', 'src/**/*.html'], ['moveHTML']);
    gulp.watch(['src/app.js', 'src/**/*js'], ['scripts']);
    gulp.watch(['src/**/*.css'], ['moveCSS']);
});