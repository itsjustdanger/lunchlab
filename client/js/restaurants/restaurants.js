var RestaurantsController = require('./restaurants-controller.js');
var RestaurantsService = require('./restaurants-service.js');
var Restaurant = require('./restaurant.js');

angular.module('restaurants', [])
        .service('restaurantsService', RestaurantsService)
        .controller('restaurantsController', RestaurantsController)
        .directive('restaurant', Restaurant);
