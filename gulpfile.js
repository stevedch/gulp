var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    pngquant = require('imagemin-pngquant'),
    header = require('gulp-header'),
    rename = require('gulp-rename'),
    minifyCSS = require('gulp-minify-css'),
    package = require('./package.json');


var banner = [
    '/*!\n' +
    ' * <%= package.name %>\n' +
    ' * <%= package.title %>\n' +
    ' * <%= package.url %>\n' +
    ' * @author <%= package.author %>\n' +
    ' * @version <%= package.version %>\n' +
    ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
    ' */',
    '\n'
].join('');

gulp.task('css', function () {
    return gulp.src('dist/scss/style.scss')
        .pipe(sass({errLogToConsole: true}))
        .pipe(autoprefixer('last 2 version', 'Chrome', 'Firefox', 'Opera 12.1', 'IE9', 'safari 5', 'IOS 6', 'android 4'))
        .pipe(gulp.dest('src/css'))
        .pipe(minifyCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(header(banner, {package: package}))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('concat-scripts', function () {
    return gulp.src(['dist/js/*.js'])
        .pipe(concat('script.js'))
        .pipe(gulp.dest('dist/js/concat-scripts'));
});

gulp.task('js', function () {
    gulp.src('dist/js/concat-scripts/script.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(header(banner, {package: package}))
        .pipe(gulp.dest('src/js'))
        .pipe(uglify())
        .pipe(header(banner, {package: package}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('src/js'))
        .pipe(browserSync.reload({stream: true, once: true}));
});

gulp.task('imagemin', function () {
    return gulp.src('dist/img/*.+(jpg|jpeg|png|gif|svg)')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('src/img'));
});

gulp.task('browser-sync', function () {
    browserSync.init(null, {
        server: {
            baseDir: "src"
        }
    });
});
gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('default', ['css', 'js', 'browser-sync', 'concat-scripts'], function () {
    gulp.watch("dist/scss/*/*.scss", ['css']);
    gulp.watch("dist/js/concat-scripts/script.js", ['js']);
    gulp.watch("dist/js/*.js", ['concat-scripts']);
    gulp.watch("src/*.html", ['bs-reload']);
});