/**
 * Created by vtu on 12/15/16.
 */

'use strict';

angular
  .module('blogvt')
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    routes
  ]);

function routes($stateProvider, $urlRouterProvider) {

  $stateProvider.state('home', {
    url: '/home',
    templateUrl: 'app/views/main.html',
    ncyBreadcrumb: {
      label: 'Home'
    }
  })
    .state('newPost', {
      url: '/newPost',
      templateUrl: 'app/views/contentPage.html',
      ncyBreadcrumb: {
        label: 'New Post',
        parent: 'home'
      }
    });

  $urlRouterProvider.otherwise('/home');
}
