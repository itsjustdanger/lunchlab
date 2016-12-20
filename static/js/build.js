(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./restaurants/restaurants.js":5}],2:[function(require,module,exports){
var Restaurant = function() {
  return {
    template: '<a href="/restaurant/{[restaurant.id]}">{[restaurant.name]}</a>',
    restrict: 'E',
    scope: {
      restaurant: '=data'
    }
  }
};

module.exports = Restaurant;

},{}],3:[function(require,module,exports){
var RestaurantsController = function(restaurantsService) {
  this._restaurantsService = restaurantsService
  this.restaurants = [];

  this.getRestaurants();
};

RestaurantsController.prototype.getRestaurants = function() {

  this._restaurantsService.getRestaurants().
    then(function success(response) {

      this.restaurants = response.data;
    }.bind(this));
};

module.exports = RestaurantsController;

},{}],4:[function(require,module,exports){
var RestaurantsService = function($http) {
  this._$http = $http;
};

RestaurantsService.prototype.getRestaurants = function() {
  return this._$http.get('api/restaurants/');
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

},{"./restaurant.js":2,"./restaurants-controller.js":3,"./restaurants-service.js":4}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvanMvYXBwLmpzIiwiY2xpZW50L2pzL3Jlc3RhdXJhbnRzL3Jlc3RhdXJhbnQuanMiLCJjbGllbnQvanMvcmVzdGF1cmFudHMvcmVzdGF1cmFudHMtY29udHJvbGxlci5qcyIsImNsaWVudC9qcy9yZXN0YXVyYW50cy9yZXN0YXVyYW50cy1zZXJ2aWNlLmpzIiwiY2xpZW50L2pzL3Jlc3RhdXJhbnRzL3Jlc3RhdXJhbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciByZXN0YXVyYW50cyA9IHJlcXVpcmUoJy4vcmVzdGF1cmFudHMvcmVzdGF1cmFudHMuanMnKTtcblxuYW5ndWxhclxuICAubW9kdWxlKCdsdW5jaGxhYicsIFsncmVzdGF1cmFudHMnXSlcbiAgLmNvbmZpZyhbICckaW50ZXJwb2xhdGVQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJGludGVycG9sYXRlUHJvdmlkZXIpIHtcbiAgICAgICRpbnRlcnBvbGF0ZVByb3ZpZGVyXG4gICAgICAgIC5zdGFydFN5bWJvbCgne1snKVxuICAgICAgICAuZW5kU3ltYm9sKCddfScpO1xuXG4gICAgICAvLyAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLnhzcmZDb29raWVOYW1lID0gJ2NzcmZ0b2tlbic7XG4gICAgICAvLyAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLnhzcmZIZWFkZXJOYW1lID0gJ1hfQ1NSRlRPS0VOJztcbiAgICB9XG4gIF0pO1xuXG5hbmd1bGFyLmJvb3RzdHJhcChkb2N1bWVudCwgWydsdW5jaGxhYiddKTtcbiIsInZhciBSZXN0YXVyYW50ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgdGVtcGxhdGU6ICc8YSBocmVmPVwiL3Jlc3RhdXJhbnQve1tyZXN0YXVyYW50LmlkXX1cIj57W3Jlc3RhdXJhbnQubmFtZV19PC9hPicsXG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICBzY29wZToge1xuICAgICAgcmVzdGF1cmFudDogJz1kYXRhJ1xuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZXN0YXVyYW50O1xuIiwidmFyIFJlc3RhdXJhbnRzQ29udHJvbGxlciA9IGZ1bmN0aW9uKHJlc3RhdXJhbnRzU2VydmljZSkge1xuICB0aGlzLl9yZXN0YXVyYW50c1NlcnZpY2UgPSByZXN0YXVyYW50c1NlcnZpY2VcbiAgdGhpcy5yZXN0YXVyYW50cyA9IFtdO1xuXG4gIHRoaXMuZ2V0UmVzdGF1cmFudHMoKTtcbn07XG5cblJlc3RhdXJhbnRzQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0UmVzdGF1cmFudHMgPSBmdW5jdGlvbigpIHtcblxuICB0aGlzLl9yZXN0YXVyYW50c1NlcnZpY2UuZ2V0UmVzdGF1cmFudHMoKS5cbiAgICB0aGVuKGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcblxuICAgICAgdGhpcy5yZXN0YXVyYW50cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzdGF1cmFudHNDb250cm9sbGVyO1xuIiwidmFyIFJlc3RhdXJhbnRzU2VydmljZSA9IGZ1bmN0aW9uKCRodHRwKSB7XG4gIHRoaXMuXyRodHRwID0gJGh0dHA7XG59O1xuXG5SZXN0YXVyYW50c1NlcnZpY2UucHJvdG90eXBlLmdldFJlc3RhdXJhbnRzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLl8kaHR0cC5nZXQoJ2FwaS9yZXN0YXVyYW50cy8nKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzdGF1cmFudHNTZXJ2aWNlO1xuIiwidmFyIFJlc3RhdXJhbnRzQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vcmVzdGF1cmFudHMtY29udHJvbGxlci5qcycpO1xudmFyIFJlc3RhdXJhbnRzU2VydmljZSA9IHJlcXVpcmUoJy4vcmVzdGF1cmFudHMtc2VydmljZS5qcycpO1xudmFyIFJlc3RhdXJhbnQgPSByZXF1aXJlKCcuL3Jlc3RhdXJhbnQuanMnKTtcblxuYW5ndWxhci5tb2R1bGUoJ3Jlc3RhdXJhbnRzJywgW10pXG4gICAgICAgIC5zZXJ2aWNlKCdyZXN0YXVyYW50c1NlcnZpY2UnLCBSZXN0YXVyYW50c1NlcnZpY2UpXG4gICAgICAgIC5jb250cm9sbGVyKCdyZXN0YXVyYW50c0NvbnRyb2xsZXInLCBSZXN0YXVyYW50c0NvbnRyb2xsZXIpXG4gICAgICAgIC5kaXJlY3RpdmUoJ3Jlc3RhdXJhbnQnLCBSZXN0YXVyYW50KTtcbiJdfQ==
