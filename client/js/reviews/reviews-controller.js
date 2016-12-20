var ReviewsController = function(reviewsService) {
  this._reviewsService = reviewsService;
  this.reviews = [];
  this.restaurantId = document.getElementById('restaurant-id').value;
  this.newReview = {title: '', body: '', restaurantId: this.restaurantId};
  this.newReviewErrors = [];
  this.getReviews(this.restaurantId);
};

ReviewsController.prototype.getReviews = function(restaurantId) {
  this._reviewsService.getReviews(restaurantId)
    .then(function success (response) {

      this.reviews = response.data;
    }.bind(this));
};

ReviewsController.prototype.submitNewReview = function() {
  console.log('test');
  console.log(this.newReview.title);
  console.log(this.newReview.body);
  if (this.newReview.title && this.newReview.body) {
    this._reviewsService
      .submitNewReview(this.newReview)
      .then(function success(response) {
        this.reviews.push(response.data);
      }.bind(this), function error(response) {
        console.log('Error submitting new review.');
      });
  }
};


module.exports = ReviewsController;
