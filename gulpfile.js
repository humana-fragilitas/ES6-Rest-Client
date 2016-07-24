'use strict';

let gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rollup = require('gulp-rollup'),
    babel = require('gulp-babel'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    webserver = require('gulp-webserver'),
    watch = require('gulp-watch'),
    sourcemaps = require('gulp-sourcemaps'),
    notify = require("gulp-notify"),
    batch = require('gulp-batch'),
    eslint = require('gulp-eslint'),
    header = require('gulp-header');
    
let packageInfo = require('./package.json'),
    headerTemplate = '/**\n' +
                     ' * <%= name %> - v<%= version %> - ' +
                     '<%= (new Date()).toUTCString() %>\n' +
                     '<%= homepage ? " * " + homepage + "\\n" : "" %>' +
                     ' * Copyright (c) 2015-<%= (new Date()).getFullYear()  %> <%= author %>;' +
                     ' Licensed <%= license %>\n' +
                     ' */\n';

function errorHandler(error){
    
    return `\nAn error occurred.\n`     + 
           `Exception: ${error.name}\n` +
           `Description: ${error.message}`;
    
}

gulp.task('js-lint-dist', () => {

    return gulp.src('src/**/*.es6.js')
               .pipe(eslint())
               .pipe(eslint.format())
               .pipe(eslint.failAfterError());

});

gulp.task('dist-test-es6', ['dist-script-es6'], () => {

    return gulp.src('test/test.es6.js')
               .pipe(plumber({ errorHandler: notify.onError(errorHandler) }))
               .pipe(rollup())
               .pipe(rename('test.js'))
               .pipe(plumber.stop())
               .pipe(gulp.dest('test'));

});
    
gulp.task('dist-script-es6', ['js-lint-dist'], () => {

   return gulp.src('src/proxy.es6.js')
              .pipe(plumber({ errorHandler: notify.onError(errorHandler) }))
              .pipe(sourcemaps.init())
              .pipe(rollup({ sourceMap: true }))
              .pipe(rename('client.es6.js'))
              .pipe(header(headerTemplate, packageInfo))
              .pipe(sourcemaps.write('.'))
              .pipe(plumber.stop())
              .pipe(gulp.dest('dist'));

});

gulp.task('dist-script-umd', ['js-lint-dist'], () => {

    return gulp.src('src/proxy.es6.js')
               .pipe(plumber({ errorHandler: notify.onError(errorHandler) }))
               .pipe(sourcemaps.init())
               .pipe(rollup({ sourceMap: true }))
               .pipe(babel())
               .pipe(uglify())
               .pipe(rename('client.umd.js'))
               .pipe(header(headerTemplate, packageInfo))
               .pipe(sourcemaps.write('.'))
               .pipe(plumber.stop())
               .pipe(gulp.dest('dist'));

});

gulp.task('test', () =>  {

    return gulp.src('.')
               .pipe(webserver({
                   
                   open: './test/index.html'
                   
                }));

});

gulp.task('watch', () =>  {
    
    watch('./src/**/*.js', batch((events, done) => {
        
        gulp.start('dist-scripts', done);
        
    }));
    
});

gulp.task('default', ['dist-script-es6', 'dist-test-es6', 'dist-script-umd']);
