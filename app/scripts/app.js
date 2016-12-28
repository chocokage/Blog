'use strict';

/**
 * Main module of the application.
 */
angular
  .module('blogvt', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'ui.select',
    'datatables',
    'uiSwitch',
    'ngMaterial',
    'ngMessages',
    'md.data.table',
    'ngDraggable',
    'chart.js',
    'ui.router',
    'ncy-angular-breadcrumb',
    'summernote'
  ])
  .config(['$compileProvider', '$httpProvider', '$breadcrumbProvider', function ($compileProvider, $httpProvider, $breadcrumbProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
      $httpProvider.defaults.headers.get = {};
    }

    // Answer edited to include suggestions from comments
    // because previous version of code introduced browser-related errors

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

    $compileProvider.debugInfoEnabled(false); // speed up angular performance to not print debug info;

    $breadcrumbProvider.setOptions({
      templateUrl: 'app/views/header.html'
    })
  }]);

