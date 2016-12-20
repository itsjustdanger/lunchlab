var RestaurantsService = function($http) {
  this._$http = $http;
};

RestaurantsService.prototype.getReviews = function(restaurantId) {
  return this._$http.get('api/reviews/?restaurant=' + resourceId);
};

module.exports = RestaurantsService;
