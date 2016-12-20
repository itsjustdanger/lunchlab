var RestaurantsController = function(restaurantsService) {
  this._restaurantsService = restaurantsService;
  this.restaurants = [];

  this.getRestaurants();
};

RestaurantsController.prototype.getRestaurants = function() {

  this._restaurantsService.getRestaurants()
    .then(function success(response) {

      this.restaurants = response.data;
    }.bind(this));
};

RestaurantsController.prototype.visit = function(index) {
  this._restaurantsService.visitRestaurant(this.restaurants[index].id)
    .then(function success(response) {
      this.restaurants[index].visited = true;
    }, function error(response) {
      console.log('Error on visit post');
    });
};

module.exports = RestaurantsController;
