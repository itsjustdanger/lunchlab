var AdminRestaurantsController = function(adminRestaurantsService, $timeout, $scope) {
  this._adminRestaurantsService = adminRestaurantsService;
  this._$scope = $scope;
  this.map = undefined;
  this.searchBox = undefined;
  this.restaurantId = document.getElementsByName('restaurant-id')[0].value;
  this.marker;
  this.restaurant = {};

  this.initMap();
  if (this.restaurantId) {
    this.loadRestaurant(this.restaurantId);
  }

};

AdminRestaurantsController.prototype.initMap = function() {
  this.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: new google.maps.LatLng(40.73, -73.99),
  });

  this.searchBox = new google.maps.places.SearchBox(document.getElementById('address-input'));
  this.searchBox.bindTo('bounds', this.map);

  this.getCurrentLocation(this.map);

  this.searchBox.addListener('places_changed', function() {
    var results = this.searchBox.getPlaces();
    var bounds = this.map.getBounds();

    if (results.length === 0) {
      console.log('nothing found');
      return;
    }

    this.marker = this._adminRestaurantsService
        .generateMapMarkers(results, this.marker, this.map);
    this.map.fitBounds(bounds);
    this.autocompleteForm(results);
    this._$scope.$apply();
  }.bind(this));
};

AdminRestaurantsController.prototype.autocompleteForm = function(results) {
  this.restaurant.name     = results[0].name;
  this.restaurant.address  = results[0].formatted_address;
  this.restaurant.lat      = results[0].geometry.location.lat();
  this.restaurant.lng      = results[0].geometry.location.lng();
};

AdminRestaurantsController.prototype.getCurrentLocation = function(map) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      map.setCenter(pos);
    }, function() {
      console.log('Error loading current location.');
    });
  }
};

AdminRestaurantsController.prototype.submitNewRestaurant = function() {
  console.log('test')
  document.getElementById('new-restaurant-form').submit();
};

AdminRestaurantsController.prototype.loadRestaurant = function(id) {
  this._adminRestaurantsService
    .getRestaurant(id)
    .then(function success(response) {
      this.restaurant = response.data;

    }.bind(this));
};

module.exports = AdminRestaurantsController;
