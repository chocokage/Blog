/**
 * Created by Vincent on 12/25/16.
 */
'use strict';

angular.module('blogvt')
  .controller('PostCtrl', function () {
    var vm = this;
    vm.categories = [
      'Foods',
      'Travels',
      'Games',
      'Random'
    ];
  });
