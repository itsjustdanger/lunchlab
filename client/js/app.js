var restaurants = require('./restaurants/restaurants.js');

angular
  .module('lunchlab', ['restaurants'])
  .config([ '$interpolateProvider',
    function($interpolateProvider) {
      $interpolateProvider
        .startSymbol('{[')
        .endSymbol(']}');

      // $httpProvider.defaults.xsrfCookieName = 'csrftoken';
      // $httpProvider.defaults.xsrfHeaderName = 'X_CSRFTOKEN';
    }
  ]);

angular.bootstrap(document, ['lunchlab']);
