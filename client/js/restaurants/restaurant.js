var Restaurant = function() {
  return {
    templateUrl: './staticfiles/templates/restaurants/restaurant.html',
    restrict: 'E',
    scope: {
      restaurant: '=data'
    }
  };
};

module.exports = Restaurant;
