var Review = function() {
  return {
    templateUrl: '/static/templates/reviews/review.html',
    restrict: 'E',
    scope: {
      review: '=data'
    },
    // controller: 'reviewsController as ctrl'
  };
};

module.exports = Review;
