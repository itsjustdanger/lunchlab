var restaurants = require('./restaurants/restaurants.js');
var reviews = require('./reviews/reviews.js');
var comments = require('./comments/comments.js');
var adminRestaurants = require('./admin-restaurants/admin-restaurants.js');


angular
  .module('lunchlab', [ 'restaurants',
                        'reviews',
                        'comments',
                        'adminRestaurants'
                      ])
  .config([ '$interpolateProvider',
            '$httpProvider',
            '$qProvider',
    function($interpolateProvider, $httpProvider, $qProvider) {
      $interpolateProvider
        .startSymbol('{[')
        .endSymbol(']}');

      // $httpProvider.defaults.xsrfCookieName = 'csrftoken';
      $httpProvider.defaults.xsrfHeaderName = 'X_CSRFTOKEN';

      // Fix erroneous unhandled error logs...thanks angular 1.5.9...
      $qProvider.errorOnUnhandledRejections(false);
    }
  ]).
  run(function run ($http) {
    // Get the CSRF token from the {% csrf_token %} tag
    var csrf_token = document.getElementsByName('csrfmiddlewaretoken')[0].value;

    // For CSRF token compatibility with Django
    $http.defaults.headers.common["X-CSRFToken"] = csrf_token;
  });

angular.bootstrap(document, ['lunchlab']);
