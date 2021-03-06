var AdminRestaurantsController = function(adminRestaurantsService, $timeout, $scope) {
  var currentLocation;

  this._adminRestaurantsService = adminRestaurantsService;
  this._$scope = $scope;
  this.map = undefined;
  this.searchBox = undefined;
  this.restaurantId = document.getElementsByName('restaurant-id')[0].value;
  this.marker;
  this.restaurant = {};

  if (this.restaurantId) {
    this.loadRestaurant(this.restaurantId);
  } else {
    this.initMap();
  }
};

AdminRestaurantsController.prototype.initMap = function(center) {
  var mapEl = document.getElementById('map');
  var searchEl = document.getElementById('address-input');

  this.map = new google.maps.Map(mapEl,
    { zoom: 15, center: center });

  if (!center) {
    this.getCurrentLocation(this.map);
  }

  this.searchBox = new google.maps.places.SearchBox(searchEl);
  this.searchBox.bindTo('bounds', this.map);

  this.searchBox.addListener('places_changed', function() {
    var results = this._adminRestaurantsService
        .search(this.searchBox, this.map, this.marker);

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
      var latLng = {lat: parseFloat(this.restaurant.lat),
                    lng: parseFloat(this.restaurant.lng)};

      this.marker = new google.maps.Marker({
        position: latLng,
        animation: google.maps.Animation.DROP
      });

      this.initMap(this.marker.position);
      this.marker.setMap(this.map);

    }.bind(this), function error(response) {
      console.log('error');
    });
};

module.exports = AdminRestaurantsController;
