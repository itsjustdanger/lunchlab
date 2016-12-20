var Restaurant = function() {
  return {
    template: '<a href="/restaurants/{[restaurant.id]}">{[restaurant.name]}</a>',
    restrict: 'E',
    scope: {
      restaurant: '=data'
    }
  }
};

module.exports = Restaurant;
