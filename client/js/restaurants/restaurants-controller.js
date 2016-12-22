var RestaurantsController = function(restaurantsService) {
  this._restaurantsService = restaurantsService;
  this.visited = [];
  this.unvisited = [];

  this.getRestaurants();
};

RestaurantsController.prototype.getRestaurants = function() {

  this._restaurantsService
    .getRestaurants()
    .then(function success(response) {
      var restaurants = response.data;

      restaurants.forEach(function (restaurant) {
        console.log(restaurant);

        if (restaurant.visited) {
          this.visited.push(restaurant);
        } else {
          this.unvisited.push(restaurant);
        }
      }.bind(this));
    }.bind(this));
};

RestaurantsController.prototype.visit = function(index) {
  this._restaurantsService
    .visitRestaurant(this.unvisited[index].id)
    .then(function success() {
      var restaurant = this.unvisited.splice(index, 1)[0];

      restaurant.visited = true;
      this.visited.push(restaurant);
    }.bind(this), function error(response) {
      console.log('Error on visit post');
    });
};

RestaurantsController.prototype.thumbsDown = function(restaurantList, index) {
  this._restaurantsService
    .thumbsDownRestaurant(this[restaurantList][index].id)
    .then(function success() {
      this[restaurantList].splice(index, 1);
    }.bind(this), function error(response) {
      console.log('Error on thumbs down');
    });
};

module.exports = RestaurantsController;
