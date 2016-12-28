// Generated on 2016-12-15 using generator-angular 0.15.1
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var openURL = require('open');
var lazypipe = require('lazypipe');
var rimraf = require('rimraf');
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');
var inject = require('gulp-inject');
var series = require('stream-series');
var bowerFiles = require('main-bower-files');
var stylus = require('gulp-stylus');
var es = require('event-stream');
var plugins = require('gulp-load-plugins')();
var through = require('through2');


var yeoman = {
  app: require('./bower.json').appPath || 'app',
  appName: require('./package.json').name || 'blogvt',
  version: require('./package.json').version || '0.0.0',
  dist: 'dist'
};

var paths = {
  scripts: [yeoman.app + '/scripts/**/*.js'],
  styles: [yeoman.app + '/styles/**/*.css'],
  test: ['test/spec/**/*.js'],
  testRequire: [
    'lib/angular/angular.js',
    'lib/angular-mocks/angular-mocks.js',
    'lib/angular-resource/angular-resource.js',
    'lib/angular-cookies/angular-cookies.js',
    'lib/angular-sanitize/angular-sanitize.js',
    'lib/angular-route/angular-route.js',
    'test/mock/**/*.js',
    'test/spec/**/*.js'
  ],
  karma: 'karma.conf.js',
  views: {
    main: 'index.html',
    files: [yeoman.app + '/views/**/*.html']
  }
};

////////////////////////
// Reusable pipelines //
////////////////////////

var lintScripts = lazypipe()
  .pipe($.jshint, '.jshintrc')
  .pipe($.jshint.reporter, 'jshint-stylish');

var styles = lazypipe()
  .pipe($.autoprefixer, 'last 1 version')
  .pipe(gulp.dest, '.tmp/styles');

///////////
// Tasks //
///////////

var cssFiles = gulp.src('./app/styles/**/*.css')
  .pipe(stylus())
  .pipe(gulp.dest('./build'));

gulp.task('inject', function () {
  var target = gulp.src('./index.html');
  // // It's not necessary to read the files (will speed up things), we're only after their paths:
  // var sources = gulp.src(['./src/**/*.js', './src/**/*.css'], {read: false});

  return target.pipe(inject(gulp.src(bowerFiles(), {base: './lib'}, {read: false}), {name: 'bower'}))
    .pipe(inject(es.merge(
      cssFiles,
      gulp.src('./app/scripts/**/*.js', {read: false})
    )))
    .pipe(gulp.dest('./'));
});

gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe(styles());
});

gulp.task('lint:scripts', function () {
  return gulp.src(paths.scripts)
    .pipe(lintScripts());
});

gulp.task('clean:tmp', function (cb) {
  rimraf('./.tmp', cb);
});

gulp.task('start:client', ['start:server', 'styles'], function () {
  openURL('http://localhost:9000');
});

gulp.task('start:server', function () {
  $.connect.server({
    root: ['./', yeoman.app, '.tmp'],
    livereload: true,
    // Change this to '0.0.0.0' to access the server from outside.
    port: 9000
  });
});

gulp.task('start:server:test', function () {
  $.connect.server({
    root: ['test', yeoman.app, '.tmp'],
    livereload: true,
    port: 9001
  })
});

gulp.task('watch', function () {
  $.watch(paths.styles)
    .pipe($.plumber())
    .pipe(styles())
    .pipe($.connect.reload());

  $.watch(paths.views.files)
    .pipe($.plumber())
    .pipe($.connect.reload());

  $.watch(paths.scripts)
    .pipe($.plumber())
    .pipe(lintScripts())
    .pipe($.connect.reload());

  $.watch(paths.test)
    .pipe($.plumber())
    .pipe(lintScripts());

  gulp.watch('bower.json', ['bower']);
});

gulp.task('serve', function (cb) {
  runSequence('clean:tmp',
    ['lint:scripts'],
    ['start:client'],
    'watch', cb);
});

gulp.task('serve:prod', function () {
  $.connect.server({
    root: [yeoman.dist],
    livereload: true,
    port: 9000
  });
});

gulp.task('test', ['start:server:test'], function () {
  var testToFiles = paths.testRequire.concat(paths.scripts, paths.test);
  return gulp.src(testToFiles)
    .pipe($.karma({
      configFile: paths.karma,
      action: 'watch'
    }));
});


///////////
// Build //
///////////

gulp.task('clean:dist', function (cb) {
  rimraf('./dist', cb);
});

gulp.task('client:build', ['html', 'styles'], function () {
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var htmlFile = '*.html';
  var ipregex = /(http:\/\/)(\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}:\d{4})\/api/g

  return gulp.src(paths.views.main)
    .pipe($.useref({searchPath: [yeoman.app, '.tmp', 'lib']}))
    .pipe(jsFilter)
    .pipe($.replace(ipregex, '/api'))
    .pipe($.ngAnnotate())
    .pipe($.uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.minifyCss({cache: true}))
    .pipe(cssFilter.restore())
    .pipe($.rev())
    // fix a bug with gulp-rev renaming index.html index-{hash}.html
    // this is not our desired result. Rename back to index.html
    .pipe(plugins.if(htmlFile, through.obj(function (file, enc, cb) {
      if (file.isNull()) {
        cb(null, file);
        return;
      }

      if (file.isStream()) {
        cb(new Error('Streaming not supported'));
        return;
      }

      // rename to index, main, login
      if (file.path.indexOf('index-') !== -1) file.path = file.revOrigPath;

      cb(null, file);
    })))
    .pipe($.revReplace())
    .pipe(gulp.dest(yeoman.dist));
});

gulp.task('html', function () {
  return gulp.src(yeoman.app + '/views/**/*')
    .pipe(gulp.dest(yeoman.dist + '/' + yeoman.app + '/views'));
});

gulp.task('copy:images', function () {
  return gulp.src([
    yeoman.app + '/images/**/*',
    'lib/datatables/media/images/*'
  ]).pipe($.cache($.imagemin({
    optimizationLevel: 5,
    progressive: true,
    interlaced: true
  })))
    .pipe(gulp.dest(yeoman.dist + '/images'));
});

gulp.task('copy:extras', function () {
  return gulp.src(['./*.{html,txt,ico}'])
    .pipe(gulp.dest(yeoman.dist));
});

gulp.task('copy:fonts', function () {
  return gulp.src([
    'lib/bootstrap/dist/fonts/*',
    'lib/font-awesome/fonts/*'
  ]).pipe(gulp.dest(yeoman.dist + '/fonts'));
});

gulp.task('build', ['clean:dist'], function () {
  runSequence(['copy:images', 'copy:extras', 'copy:fonts', 'client:build'], ['tarball', 'zip']);
});

/*
 * build distribution tar.gz
 */

gulp.task('tarball', function () {
  var tarball = yeoman.appName + '-' + yeoman.version + '.tar';
  return gulp.src(yeoman.dist + '/**/*')
  // to fix issue with "Cannot open: Permission denied"
  // when extracting on linux, set "{mode: null}"
    .pipe(plugins.tar(tarball, {mode: null}))
    .pipe(plugins.gzip())
    .pipe(gulp.dest(yeoman.dist));
});

/*
 * build distribution zip file
 */

gulp.task('zip', function () {
  var zipfile = yeoman.appName + '-' + yeoman.version + '.zip';
  return gulp.src(yeoman.dist + '/**/*')
  // to fix issue with "Cannot open: Permission denied"
  // when extracting on linux, set "{mode: null}"
    .pipe(plugins.zip(zipfile, {mode: null}))
    .pipe(gulp.dest(yeoman.dist));
});

gulp.task('default', ['build']);
