var AdminRestaurantsController = function(adminRestaurantsService) {
  this._adminRestaurantsService = adminRestaurantsService;
  this.map = undefined;
  this.searchBox = undefined;
  this.markers = [];
  this.mapEl = document.getElementById('map');
  this.input = document.getElementById('address-input');

  this.initMap();
};

AdminRestaurantsController.prototype.initMap = function() {
  this.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: new google.maps.LatLng(40.73, -73.99),
    mapTypeId: 'terrain'
  });

  // console.log(this.map);
  // console.log(this.mapEl);

  this.searchBox = new google.maps.places.SearchBox(this.input);
  this.searchBox.bindTo('bounds', this.map);

  this.searchBox.addListener('places_changed', function() {
    var results = this.searchBox.getPlaces();
    var bounds = this.map.getBounds();

    if (results.length === 0) {
      console.log('nothing found');
      return;
    }

    this.generateMarkers(results, bounds);
    this.map.fitBounds(bounds);
  }.bind(this));
};

AdminRestaurantsController.prototype.generateMarkers = function(results, bounds) {
  this.clearMarkers();

  for (var i = 0; i < results.length; i++) {
    this.markers[i] = new google.maps.Marker({
      position: results[i].geometry.location,
      animation: google.maps.Animation.DROP,
    });

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
  }.bind(this)
};

AdminRestaurantsController.prototype.clearMarkers = function() {
  this.markers.forEach(function(marker) {
    marker.setMap(null);
  }.bind(this));

  this.markers = [];
};

module.exports = AdminRestaurantsController;
