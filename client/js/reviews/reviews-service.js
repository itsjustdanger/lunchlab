var ReviewsService = function($http) {
  this._$http = $http;
};

ReviewsService.prototype.getReviews = function(restaurantId) {
  return this._$http.get('/api/reviews/?restaurant=' + restaurantId);
};

ReviewsService.prototype.submitNewReview = function(newReview) {
  var url = '/api/reviews/new/?restaurant=' + newReview.restaurantId + '/';
  
  return this._$http({
    method  : 'POST',
    url     : url,
    data    : newReview
  });
};

module.exports = ReviewsService;
