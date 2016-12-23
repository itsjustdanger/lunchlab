var AdminRestaurantsService = function($http) {
  this._$http = $http;
};

AdminRestaurantsService.prototype.submitNewRestaurant = function(restaurantData) {
  var url = '/api/restaurants/new/';

  return this._$http({
    method: 'POST',
    url: url,
    data: restaurantData
  });
};

AdminRestaurantsService.prototype.getRestaurant = function(restaurantId) {
  var url = '/api/restaurants/' + restaurantId + '/';
  
  return this._$http.get(url);
};

AdminRestaurantsService.prototype.generateMapMarkers = function(locations, marker, map) {
  var i;
  var bounds = map.getBounds();

  if (marker) {
    marker.setMap(null);
  }

  for (i = 0; i < locations.length; i++) {
    marker = new google.maps.Marker({
      position: locations[i].geometry.location,
      animation: google.maps.Animation.DROP,
    });

    setTimeout(this.dropMarker(marker, i, map), i * 100);

    if (bounds) {
      if (locations[i].geometry.viewport) {
        bounds.union(locations[i].geometry.viewport);
      }

      bounds.extend(locations[i].geometry.location);
    }
  }

  map.fitBounds(bounds);
};

AdminRestaurantsService.prototype.search = function(searchBox, map, marker) {
  var results = searchBox.getPlaces();

  if (results.length === 0) {
    console.log('nothing found!');
    return false;
  }

  this.generateMapMarkers(results, marker, map);

  return results;
};

AdminRestaurantsService.prototype.dropMarker = function(marker, i, map) {
  return function() {
    marker.setMap(map);
  }
};

module.exports = AdminRestaurantsService;
