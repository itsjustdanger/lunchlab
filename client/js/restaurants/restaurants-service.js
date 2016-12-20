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
