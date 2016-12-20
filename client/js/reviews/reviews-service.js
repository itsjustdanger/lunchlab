var RestaurantsService = function($http) {
  this._$http = $http;
};

RestaurantsService.prototype.getReviews = function(restaurantId) {
  return this._$http.get('/api/reviews/?restaurant=' + restaurantId);
};

RestaurantsService.prototype.submitNewReview = function(newReview) {
  var url = '/api/reviews/new/?restaurant=' + newReview.restaurantId + '/';
  console.log(newReview);
  return this._$http({
    method  : 'POST',
    url     : url,
    data    : newReview
  });
};

module.exports = RestaurantsService;
