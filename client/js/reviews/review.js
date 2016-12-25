var Review = function() {
  return {
    templateUrl: '/staticfiles/templates/reviews/review.html',
    restrict: 'E',
    scope: {
      review: '=data'
    },
    // controller: 'reviewsController as ctrl'
  };
};

module.exports = Review;
