var ReviewsController = function(reviewsService) {
  this._reviewsService = reviewsService;
  this.reviews = [];
  this.restaurantId = document.getElementById('restaurant-id').value;

  this.getReviews(this.restaurantId);
};

ReviewsController.prototype.getReviews = function(restaurantId) {

  this._reviewsService.getReviews(restaurantId)
    .then(function success (response) {

      this.reviews = response.data;
    }.bind(this));
};


module.exports = ReviewsController;
