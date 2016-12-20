var RestaurantsController = function(restaurantsService) {
  this._restaurantsService = restaurantsService
  this.restaurants = [];

  this.getRestaurants();
};

RestaurantsController.prototype.getRestaurants = function() {

  this._restaurantsService.getRestaurants().
    then(function success(response) {

      this.restaurants = response.data;
    }.bind(this));
};

module.exports = RestaurantsController;
