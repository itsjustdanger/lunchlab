var ReviewsController = function(reviewsService) {
  this._reviewsService = reviewsService;
  this.reviews = [];

};

ReviewsController.prototype.getReviews = function(resourceId) {

  this._reviewsService.getReviews(resourceId)
    .then(function success (response) {

      this.reviews = response.data;
    }.bind(this));
};

module.exports = ReviewsController;
