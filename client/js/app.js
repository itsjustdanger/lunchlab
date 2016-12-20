var restaurants = require('./restaurants/restaurants.js');
var reviews = require('./reviews/reviews.js');

angular
  .module('lunchlab', ['restaurants', ,'reviews'])
  .config([ '$interpolateProvider', '$httpProvider',
    function($interpolateProvider, $httpProvider) {
      $interpolateProvider
        .startSymbol('{[')
        .endSymbol(']}');

      $httpProvider.defaults.xsrfCookieName = 'csrftoken';
      $httpProvider.defaults.xsrfHeaderName = 'X_CSRFTOKEN';
    }
  ]);

angular.bootstrap(document, ['lunchlab']);
