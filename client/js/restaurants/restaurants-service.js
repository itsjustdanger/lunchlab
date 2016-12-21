var RestaurantsService = function($http) {
  this._$http = $http;
};

RestaurantsService.prototype.getRestaurants = function() {
  return this._$http.get('api/restaurants/');
};

RestaurantsService.prototype.visitRestaurant = function(id) {
  return this._$http.post('api/restaurants/visit/' + id + '/');
};

RestaurantsService.prototype.thumbsDownRestaurant = function(id) {
  return this._$http
    .post('api/restaurants/thumbs-down/' + id + '/');
};

module.exports = RestaurantsService;
