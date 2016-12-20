var RestaurantsService = function($http) {
  this._$http = $http;
};

RestaurantsService.prototype.getRestaurants = function() {
  return this._$http.get('api/restaurants/');
};

module.exports = RestaurantsService;
