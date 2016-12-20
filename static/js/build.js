(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./restaurants/restaurants.js":5,"./reviews/reviews.js":9}],2:[function(require,module,exports){
var Restaurant = function() {
  return {
    templateUrl: './static/templates/restaurants/restaurant.html',
    restrict: 'E',
    scope: {
      restaurant: '=data'
    }
  };
};

module.exports = Restaurant;

},{}],3:[function(require,module,exports){
var RestaurantsController = function(restaurantsService) {
  this._restaurantsService = restaurantsService;
  this.restaurants = [];

  this.getRestaurants();
};

RestaurantsController.prototype.getRestaurants = function() {

  this._restaurantsService.getRestaurants()
    .then(function success(response) {

      this.restaurants = response.data;
    }.bind(this));
};

RestaurantsController.prototype.visit = function(index) {
  console.log('test');
  this._restaurantsService.visitRestaurant(this.restaurants[index].id)
    .then(function success() {
      this.restaurants[index].visited = true;
    });
};

module.exports = RestaurantsController;

},{}],4:[function(require,module,exports){
var RestaurantsService = function($http) {
  this._$http = $http;
};

RestaurantsService.prototype.getRestaurants = function() {
  return this._$http.get('api/restaurants/');
};

RestaurantsService.prototype.visitRestaurant = function(id) {
  return this._$http.post('api/restaurants/visit/' + id + '/');
};

module.exports = RestaurantsService;

},{}],5:[function(require,module,exports){
var RestaurantsController = require('./restaurants-controller.js');
var RestaurantsService = require('./restaurants-service.js');
var Restaurant = require('./restaurant.js');

angular.module('restaurants', [])
        .service('restaurantsService', RestaurantsService)
        .controller('restaurantsController', RestaurantsController)
        .directive('restaurant', Restaurant);

},{"./restaurant.js":2,"./restaurants-controller.js":3,"./restaurants-service.js":4}],6:[function(require,module,exports){
var Review = function() {
  return {
    templateUrl: '/static/templates/reviews/review.html',
    restrict: 'E',
    scope: {
      review: '=data'
    },
    // controller: 'reviewsController as ctrl'
  };
};

module.exports = Review;

},{}],7:[function(require,module,exports){
var ReviewsController = function(reviewsService) {
  this._reviewsService = reviewsService;
  this.reviews = [];
  this.restaurantId = document.getElementById('restaurant-id').value;

  this.getReviews(this.restaurantId);
};

ReviewsController.prototype.getReviews = function(restaurantId) {

  this._reviewsService.getReviews(restaurantId)
    .then(function success (response) {

      this.reviews = response.data;
    }.bind(this));
};


module.exports = ReviewsController;

},{}],8:[function(require,module,exports){
var RestaurantsService = function($http) {
  this._$http = $http;
};

RestaurantsService.prototype.getReviews = function(restaurantId) {
  return this._$http.get('/api/reviews/?restaurant=' + restaurantId);
};

module.exports = RestaurantsService;

},{}],9:[function(require,module,exports){
var ReviewsController = require('./reviews-controller.js');
var ReviewsService = require('./reviews-service.js');
var Review = require('./review.js');

angular.module('reviews', [])
        .service('reviewsService', ReviewsService)
        .controller('reviewsController', ReviewsController)
        .directive('review', Review);

},{"./review.js":6,"./reviews-controller.js":7,"./reviews-service.js":8}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvanMvYXBwLmpzIiwiY2xpZW50L2pzL3Jlc3RhdXJhbnRzL3Jlc3RhdXJhbnQuanMiLCJjbGllbnQvanMvcmVzdGF1cmFudHMvcmVzdGF1cmFudHMtY29udHJvbGxlci5qcyIsImNsaWVudC9qcy9yZXN0YXVyYW50cy9yZXN0YXVyYW50cy1zZXJ2aWNlLmpzIiwiY2xpZW50L2pzL3Jlc3RhdXJhbnRzL3Jlc3RhdXJhbnRzLmpzIiwiY2xpZW50L2pzL3Jldmlld3MvcmV2aWV3LmpzIiwiY2xpZW50L2pzL3Jldmlld3MvcmV2aWV3cy1jb250cm9sbGVyLmpzIiwiY2xpZW50L2pzL3Jldmlld3MvcmV2aWV3cy1zZXJ2aWNlLmpzIiwiY2xpZW50L2pzL3Jldmlld3MvcmV2aWV3cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgcmVzdGF1cmFudHMgPSByZXF1aXJlKCcuL3Jlc3RhdXJhbnRzL3Jlc3RhdXJhbnRzLmpzJyk7XG52YXIgcmV2aWV3cyA9IHJlcXVpcmUoJy4vcmV2aWV3cy9yZXZpZXdzLmpzJyk7XG5cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnbHVuY2hsYWInLCBbJ3Jlc3RhdXJhbnRzJywgLCdyZXZpZXdzJ10pXG4gIC5jb25maWcoWyAnJGludGVycG9sYXRlUHJvdmlkZXInLCAnJGh0dHBQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJGludGVycG9sYXRlUHJvdmlkZXIsICRodHRwUHJvdmlkZXIpIHtcbiAgICAgICRpbnRlcnBvbGF0ZVByb3ZpZGVyXG4gICAgICAgIC5zdGFydFN5bWJvbCgne1snKVxuICAgICAgICAuZW5kU3ltYm9sKCddfScpO1xuXG4gICAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLnhzcmZDb29raWVOYW1lID0gJ2NzcmZ0b2tlbic7XG4gICAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLnhzcmZIZWFkZXJOYW1lID0gJ1hfQ1NSRlRPS0VOJztcbiAgICB9XG4gIF0pO1xuXG5hbmd1bGFyLmJvb3RzdHJhcChkb2N1bWVudCwgWydsdW5jaGxhYiddKTtcbiIsInZhciBSZXN0YXVyYW50ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgdGVtcGxhdGVVcmw6ICcuL3N0YXRpYy90ZW1wbGF0ZXMvcmVzdGF1cmFudHMvcmVzdGF1cmFudC5odG1sJyxcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHNjb3BlOiB7XG4gICAgICByZXN0YXVyYW50OiAnPWRhdGEnXG4gICAgfVxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZXN0YXVyYW50O1xuIiwidmFyIFJlc3RhdXJhbnRzQ29udHJvbGxlciA9IGZ1bmN0aW9uKHJlc3RhdXJhbnRzU2VydmljZSkge1xuICB0aGlzLl9yZXN0YXVyYW50c1NlcnZpY2UgPSByZXN0YXVyYW50c1NlcnZpY2U7XG4gIHRoaXMucmVzdGF1cmFudHMgPSBbXTtcblxuICB0aGlzLmdldFJlc3RhdXJhbnRzKCk7XG59O1xuXG5SZXN0YXVyYW50c0NvbnRyb2xsZXIucHJvdG90eXBlLmdldFJlc3RhdXJhbnRzID0gZnVuY3Rpb24oKSB7XG5cbiAgdGhpcy5fcmVzdGF1cmFudHNTZXJ2aWNlLmdldFJlc3RhdXJhbnRzKClcbiAgICAudGhlbihmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG5cbiAgICAgIHRoaXMucmVzdGF1cmFudHMgPSByZXNwb25zZS5kYXRhO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5SZXN0YXVyYW50c0NvbnRyb2xsZXIucHJvdG90eXBlLnZpc2l0ID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgY29uc29sZS5sb2coJ3Rlc3QnKTtcbiAgdGhpcy5fcmVzdGF1cmFudHNTZXJ2aWNlLnZpc2l0UmVzdGF1cmFudCh0aGlzLnJlc3RhdXJhbnRzW2luZGV4XS5pZClcbiAgICAudGhlbihmdW5jdGlvbiBzdWNjZXNzKCkge1xuICAgICAgdGhpcy5yZXN0YXVyYW50c1tpbmRleF0udmlzaXRlZCA9IHRydWU7XG4gICAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc3RhdXJhbnRzQ29udHJvbGxlcjtcbiIsInZhciBSZXN0YXVyYW50c1NlcnZpY2UgPSBmdW5jdGlvbigkaHR0cCkge1xuICB0aGlzLl8kaHR0cCA9ICRodHRwO1xufTtcblxuUmVzdGF1cmFudHNTZXJ2aWNlLnByb3RvdHlwZS5nZXRSZXN0YXVyYW50cyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5fJGh0dHAuZ2V0KCdhcGkvcmVzdGF1cmFudHMvJyk7XG59O1xuXG5SZXN0YXVyYW50c1NlcnZpY2UucHJvdG90eXBlLnZpc2l0UmVzdGF1cmFudCA9IGZ1bmN0aW9uKGlkKSB7XG4gIHJldHVybiB0aGlzLl8kaHR0cC5wb3N0KCdhcGkvcmVzdGF1cmFudHMvdmlzaXQvJyArIGlkICsgJy8nKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzdGF1cmFudHNTZXJ2aWNlO1xuIiwidmFyIFJlc3RhdXJhbnRzQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vcmVzdGF1cmFudHMtY29udHJvbGxlci5qcycpO1xudmFyIFJlc3RhdXJhbnRzU2VydmljZSA9IHJlcXVpcmUoJy4vcmVzdGF1cmFudHMtc2VydmljZS5qcycpO1xudmFyIFJlc3RhdXJhbnQgPSByZXF1aXJlKCcuL3Jlc3RhdXJhbnQuanMnKTtcblxuYW5ndWxhci5tb2R1bGUoJ3Jlc3RhdXJhbnRzJywgW10pXG4gICAgICAgIC5zZXJ2aWNlKCdyZXN0YXVyYW50c1NlcnZpY2UnLCBSZXN0YXVyYW50c1NlcnZpY2UpXG4gICAgICAgIC5jb250cm9sbGVyKCdyZXN0YXVyYW50c0NvbnRyb2xsZXInLCBSZXN0YXVyYW50c0NvbnRyb2xsZXIpXG4gICAgICAgIC5kaXJlY3RpdmUoJ3Jlc3RhdXJhbnQnLCBSZXN0YXVyYW50KTtcbiIsInZhciBSZXZpZXcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICB0ZW1wbGF0ZVVybDogJy9zdGF0aWMvdGVtcGxhdGVzL3Jldmlld3MvcmV2aWV3Lmh0bWwnLFxuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgc2NvcGU6IHtcbiAgICAgIHJldmlldzogJz1kYXRhJ1xuICAgIH0sXG4gICAgLy8gY29udHJvbGxlcjogJ3Jldmlld3NDb250cm9sbGVyIGFzIGN0cmwnXG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJldmlldztcbiIsInZhciBSZXZpZXdzQ29udHJvbGxlciA9IGZ1bmN0aW9uKHJldmlld3NTZXJ2aWNlKSB7XG4gIHRoaXMuX3Jldmlld3NTZXJ2aWNlID0gcmV2aWV3c1NlcnZpY2U7XG4gIHRoaXMucmV2aWV3cyA9IFtdO1xuICB0aGlzLnJlc3RhdXJhbnRJZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50LWlkJykudmFsdWU7XG5cbiAgdGhpcy5nZXRSZXZpZXdzKHRoaXMucmVzdGF1cmFudElkKTtcbn07XG5cblJldmlld3NDb250cm9sbGVyLnByb3RvdHlwZS5nZXRSZXZpZXdzID0gZnVuY3Rpb24ocmVzdGF1cmFudElkKSB7XG5cbiAgdGhpcy5fcmV2aWV3c1NlcnZpY2UuZ2V0UmV2aWV3cyhyZXN0YXVyYW50SWQpXG4gICAgLnRoZW4oZnVuY3Rpb24gc3VjY2VzcyAocmVzcG9uc2UpIHtcblxuICAgICAgdGhpcy5yZXZpZXdzID0gcmVzcG9uc2UuZGF0YTtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFJldmlld3NDb250cm9sbGVyO1xuIiwidmFyIFJlc3RhdXJhbnRzU2VydmljZSA9IGZ1bmN0aW9uKCRodHRwKSB7XG4gIHRoaXMuXyRodHRwID0gJGh0dHA7XG59O1xuXG5SZXN0YXVyYW50c1NlcnZpY2UucHJvdG90eXBlLmdldFJldmlld3MgPSBmdW5jdGlvbihyZXN0YXVyYW50SWQpIHtcbiAgcmV0dXJuIHRoaXMuXyRodHRwLmdldCgnL2FwaS9yZXZpZXdzLz9yZXN0YXVyYW50PScgKyByZXN0YXVyYW50SWQpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZXN0YXVyYW50c1NlcnZpY2U7XG4iLCJ2YXIgUmV2aWV3c0NvbnRyb2xsZXIgPSByZXF1aXJlKCcuL3Jldmlld3MtY29udHJvbGxlci5qcycpO1xudmFyIFJldmlld3NTZXJ2aWNlID0gcmVxdWlyZSgnLi9yZXZpZXdzLXNlcnZpY2UuanMnKTtcbnZhciBSZXZpZXcgPSByZXF1aXJlKCcuL3Jldmlldy5qcycpO1xuXG5hbmd1bGFyLm1vZHVsZSgncmV2aWV3cycsIFtdKVxuICAgICAgICAuc2VydmljZSgncmV2aWV3c1NlcnZpY2UnLCBSZXZpZXdzU2VydmljZSlcbiAgICAgICAgLmNvbnRyb2xsZXIoJ3Jldmlld3NDb250cm9sbGVyJywgUmV2aWV3c0NvbnRyb2xsZXIpXG4gICAgICAgIC5kaXJlY3RpdmUoJ3JldmlldycsIFJldmlldyk7XG4iXX0=
