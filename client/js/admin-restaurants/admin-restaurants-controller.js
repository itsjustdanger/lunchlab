var AdminRestaurantsController = function(adminRestaurantsService, $timeout, $scope) {
  this._adminRestaurantsService = adminRestaurantsService;
  this._$scope = $scope;
  this.input = document.getElementById('address-input');
  this.map = undefined;
  this.mapEl = document.getElementById('map');
  this.restaurantId = document.getElementsByName('restaurant-id')[0].value;
  this.markers = [];
  this.newRestaurant = {};
  this.searchBox = undefined;
  this.searchResults = [];

  this.initMap();
  if (this.restaurantId) {
    this.loadRestaurant(this.restaurantId);
  }

};

AdminRestaurantsController.prototype.initMap = function() {
  this.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: new google.maps.LatLng(40.73, -73.99),
  });

  this.searchBox = new google.maps.places.SearchBox(this.input);
  this.searchBox.bindTo('bounds', this.map);

  this.getCurrentLocation(this.map);

  this.searchBox.addListener('places_changed', function() {
    var results = this.searchBox.getPlaces();
    var bounds = this.map.getBounds();

    if (results.length === 0) {
      console.log('nothing found');
      return;
    }

    this.generateMarkers(results, bounds);
    this.map.fitBounds(bounds);
    this._$scope.$apply();
  }.bind(this));
};

AdminRestaurantsController.prototype.generateMarkers = function(results, bounds) {
  this.clearMarkers();
  this.clearResults();

  for (var i = 0; i < results.length; i++) {
    this.markers[i] = new google.maps.Marker({
      position: results[i].geometry.location,
      animation: google.maps.Animation.DROP,
    });

    this.searchResults[i] = {
      name: results[i].name,
      // photo: results[i].photos[0].getUrl(),
      address: results[i].formatted_address,
      lat: results[i].geometry.location.lat(),
      lng: results[i].geometry.location.lng()
    };

    setTimeout(this.dropMarker(i), i * 100);

    if (bounds) {
      if (results[i].geometry.viewport) {
        bounds.union(results[i].geometry.viewport);
      }

      bounds.extend(results[i].geometry.location);
    }
  }
};

AdminRestaurantsController.prototype.dropMarker = function(i) {
  return function() {
    this.markers[i].setMap(this.map);
  }.bind(this);
};

AdminRestaurantsController.prototype.clearMarkers = function() {
  this.markers.forEach(function(marker) {
    marker.setMap(null);
  }.bind(this));

  this.markers = [];
};

AdminRestaurantsController.prototype.clearResults = function() {
  this.searchResults = [];
};

AdminRestaurantsController.prototype.autocompleteForm = function(idx) {
  this.newRestaurant.name     = this.searchResults[idx].name;
  this.newRestaurant.address  = this.searchResults[idx].address;
  this.newRestaurant.lat      = this.searchResults[idx].lat;
  this.newRestaurant.lng      = this.searchResults[idx].lng;
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
      this.newRestaurant = response.data;

    }.bind(this));
};

module.exports = AdminRestaurantsController;
