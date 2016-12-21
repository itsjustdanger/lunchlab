var AdminRestaurantsService = function($http) {
  this._$http = $http;
};

AdminRestaurantsService.prototype.submitNewRestaurant = function(restaurantData) {
  var url = '/api/restaurants/new/';

  return this._$http({
    method: 'POST',
    url: url,
    data: restaurantData
  });
};

module.exports = AdminRestaurantsService;
