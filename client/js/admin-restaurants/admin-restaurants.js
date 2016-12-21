var AdminRestaurantsController = require('./admin-restaurants-controller.js');
var AdminRestaurantsService = require('./admin-restaurants-service.js');

angular.module('adminRestaurants', [])
        .service('adminRestaurantsService', AdminRestaurantsService)
        .controller('adminRestaurantsController', AdminRestaurantsController);
