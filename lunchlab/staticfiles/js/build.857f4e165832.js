(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
var AdminRestaurantsController = require('./admin-restaurants-controller.js');
var AdminRestaurantsService = require('./admin-restaurants-service.js');

angular.module('adminRestaurants', [])
        .service('adminRestaurantsService', AdminRestaurantsService)
        .controller('adminRestaurantsController', AdminRestaurantsController);

},{"./admin-restaurants-controller.js":1,"./admin-restaurants-service.js":2}],4:[function(require,module,exports){
var restaurants = require('./restaurants/restaurants.js');
var reviews = require('./reviews/reviews.js');
var comments = require('./comments/comments.js');
var adminRestaurants = require('./admin-restaurants/admin-restaurants.js');


angular
  .module('lunchlab', [ 'restaurants',
                        'reviews',
                        'comments',
                        'adminRestaurants'
                      ])
  .config([ '$interpolateProvider',
            '$httpProvider',
            '$qProvider',
    function($interpolateProvider, $httpProvider, $qProvider) {
      $interpolateProvider
        .startSymbol('{[')
        .endSymbol(']}');

      // $httpProvider.defaults.xsrfCookieName = 'csrftoken';
      $httpProvider.defaults.xsrfHeaderName = 'X_CSRFTOKEN';

      // Fix erroneous unhandled error logs...thanks angular 1.5.9...
      $qProvider.errorOnUnhandledRejections(false);
    }
  ]).
  run(function run ($http) {
    // Get the CSRF token from the {% csrf_token %} tag
    var csrf_token = document.getElementsByName('csrfmiddlewaretoken')[0].value;

    // For CSRF token compatibility with Django
    $http.defaults.headers.common["X-CSRFToken"] = csrf_token;
  });

angular.bootstrap(document, ['lunchlab']);

},{"./admin-restaurants/admin-restaurants.js":3,"./comments/comments.js":8,"./restaurants/restaurants.js":12,"./reviews/reviews.js":16}],5:[function(require,module,exports){
var Comment = function() {
  return {
    templateUrl: '/static/templates/comments/comment.html',
    restrict: 'E',
    scope: {
      comment: '=data'
    },
  };
};

module.exports = Comment;

},{}],6:[function(require,module,exports){
var CommentsController = function(commentsService) {
  this._commentsService = commentsService;
  this.comments = [];
  this.newComment = {body: ''};
  this.newCommentErrors = [];
  this.showComments = false;
};

CommentsController.prototype.getComments = function(reviewId) {

  this._commentsService
    .getComments(reviewId)
    .then(function success (response) {
      this.comments = response.data;
      this.showComments = true;
    }.bind(this));
};

CommentsController.prototype.hideComments = function() {
  this.showComments = false;
};

CommentsController.prototype.submitNewComment = function(reviewId) {
  if (this.newComment.body) {
    this.newComment.reviewId = reviewId;
    this._commentsService
      .submitNewComment(this.newComment)
      .then(function success(response) {
        this.comments.push(response.data);
      }.bind(this), function error(response) {
        console.log('Error submitting new comment.');
      });
  }
};

module.exports = CommentsController;

},{}],7:[function(require,module,exports){
var CommentsService = function($http) {
  this._$http = $http;
};

CommentsService.prototype.getComments = function(reviewId) {
  return this._$http.get('/api/comments/?review=' + reviewId);
};

CommentsService.prototype.submitNewComment = function(newComment) {
  var url = '/api/comments/new/?review=' + newComment.reviewId + '/';

  return this._$http({
    method  : 'POST',
    url     : url,
    data    : newComment
  });
};

module.exports = CommentsService;

},{}],8:[function(require,module,exports){
var CommentsController = require('./comments-controller.js');
var CommentsService = require('./comments-service.js');
var Comment = require('./comment.js');

angular.module('comments', [])
        .service('commentsService', CommentsService)
        .controller('commentsController', CommentsController)
        .directive('comment', Comment);

},{"./comment.js":5,"./comments-controller.js":6,"./comments-service.js":7}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
var RestaurantsService = function($http) {
  this._$http = $http;
};

RestaurantsService.prototype.getRestaurants = function() {
  return this._$http.get('api/restaurants/');
};

RestaurantsService.prototype.visitRestaurant = function(id) {
  return this._$http.post('api/restaurants/visit/' + id + '/');
};

RestaurantsService.prototype.thumbsDownRestaurant = function(id) {
  return this._$http
    .post('api/restaurants/thumbs-down/' + id + '/');
};

module.exports = RestaurantsService;

},{}],12:[function(require,module,exports){
var RestaurantsController = require('./restaurants-controller.js');
var RestaurantsService = require('./restaurants-service.js');
var Restaurant = require('./restaurant.js');

angular.module('restaurants', [])
        .service('restaurantsService', RestaurantsService)
        .controller('restaurantsController', RestaurantsController)
        .directive('restaurant', Restaurant);

},{"./restaurant.js":9,"./restaurants-controller.js":10,"./restaurants-service.js":11}],13:[function(require,module,exports){
var Review = function() {
  return {
    templateUrl: '/static/templates/reviews/review.html',
    restrict: 'E',
    scope: {
      review: '=data'
    },
    // controller: 'reviewsController as ctrl'
  };
};

module.exports = Review;

},{}],14:[function(require,module,exports){
var ReviewsController = function(reviewsService) {
  this._reviewsService = reviewsService;
  this.reviews = [];
  this.restaurantId = document.getElementById('restaurant-id').value;
  this.newReview = {title: '', body: '', restaurantId: this.restaurantId};
  this.newReviewErrors = [];
  this.getReviews(this.restaurantId);
};

ReviewsController.prototype.getReviews = function(restaurantId) {
  this._reviewsService
    .getReviews(restaurantId)
    .then(function success (response) {

      this.reviews = response.data;
    }.bind(this));
};

ReviewsController.prototype.submitNewReview = function() {
  if (this.newReview.title && this.newReview.body) {
    this._reviewsService
      .submitNewReview(this.newReview)
      .then(function success(response) {
        this.reviews.push(response.data);
      }.bind(this), function error(response) {
        console.log('Error submitting new review.');
      });
  }
};


module.exports = ReviewsController;

},{}],15:[function(require,module,exports){
var ReviewsService = function($http) {
  this._$http = $http;
};

ReviewsService.prototype.getReviews = function(restaurantId) {
  return this._$http.get('/api/reviews/?restaurant=' + restaurantId);
};

ReviewsService.prototype.submitNewReview = function(newReview) {
  var url = '/api/reviews/new/?restaurant=' + newReview.restaurantId + '/';
  
  return this._$http({
    method  : 'POST',
    url     : url,
    data    : newReview
  });
};

module.exports = ReviewsService;

},{}],16:[function(require,module,exports){
var ReviewsController = require('./reviews-controller.js');
var ReviewsService = require('./reviews-service.js');
var Review = require('./review.js');

angular.module('reviews', [])
        .service('reviewsService', ReviewsService)
        .controller('reviewsController', ReviewsController)
        .directive('review', Review);

},{"./review.js":13,"./reviews-controller.js":14,"./reviews-service.js":15}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvanMvYWRtaW4tcmVzdGF1cmFudHMvYWRtaW4tcmVzdGF1cmFudHMtY29udHJvbGxlci5qcyIsImNsaWVudC9qcy9hZG1pbi1yZXN0YXVyYW50cy9hZG1pbi1yZXN0YXVyYW50cy1zZXJ2aWNlLmpzIiwiY2xpZW50L2pzL2FkbWluLXJlc3RhdXJhbnRzL2FkbWluLXJlc3RhdXJhbnRzLmpzIiwiY2xpZW50L2pzL2FwcC5qcyIsImNsaWVudC9qcy9jb21tZW50cy9jb21tZW50LmpzIiwiY2xpZW50L2pzL2NvbW1lbnRzL2NvbW1lbnRzLWNvbnRyb2xsZXIuanMiLCJjbGllbnQvanMvY29tbWVudHMvY29tbWVudHMtc2VydmljZS5qcyIsImNsaWVudC9qcy9jb21tZW50cy9jb21tZW50cy5qcyIsImNsaWVudC9qcy9yZXN0YXVyYW50cy9yZXN0YXVyYW50LmpzIiwiY2xpZW50L2pzL3Jlc3RhdXJhbnRzL3Jlc3RhdXJhbnRzLWNvbnRyb2xsZXIuanMiLCJjbGllbnQvanMvcmVzdGF1cmFudHMvcmVzdGF1cmFudHMtc2VydmljZS5qcyIsImNsaWVudC9qcy9yZXN0YXVyYW50cy9yZXN0YXVyYW50cy5qcyIsImNsaWVudC9qcy9yZXZpZXdzL3Jldmlldy5qcyIsImNsaWVudC9qcy9yZXZpZXdzL3Jldmlld3MtY29udHJvbGxlci5qcyIsImNsaWVudC9qcy9yZXZpZXdzL3Jldmlld3Mtc2VydmljZS5qcyIsImNsaWVudC9qcy9yZXZpZXdzL3Jldmlld3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgQWRtaW5SZXN0YXVyYW50c0NvbnRyb2xsZXIgPSBmdW5jdGlvbihhZG1pblJlc3RhdXJhbnRzU2VydmljZSwgJHRpbWVvdXQsICRzY29wZSkge1xuICB2YXIgY3VycmVudExvY2F0aW9uO1xuXG4gIHRoaXMuX2FkbWluUmVzdGF1cmFudHNTZXJ2aWNlID0gYWRtaW5SZXN0YXVyYW50c1NlcnZpY2U7XG4gIHRoaXMuXyRzY29wZSA9ICRzY29wZTtcbiAgdGhpcy5tYXAgPSB1bmRlZmluZWQ7XG4gIHRoaXMuc2VhcmNoQm94ID0gdW5kZWZpbmVkO1xuICB0aGlzLnJlc3RhdXJhbnRJZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdyZXN0YXVyYW50LWlkJylbMF0udmFsdWU7XG4gIHRoaXMubWFya2VyO1xuICB0aGlzLnJlc3RhdXJhbnQgPSB7fTtcblxuICBpZiAodGhpcy5yZXN0YXVyYW50SWQpIHtcbiAgICB0aGlzLmxvYWRSZXN0YXVyYW50KHRoaXMucmVzdGF1cmFudElkKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmluaXRNYXAoKTtcbiAgfVxufTtcblxuQWRtaW5SZXN0YXVyYW50c0NvbnRyb2xsZXIucHJvdG90eXBlLmluaXRNYXAgPSBmdW5jdGlvbihjZW50ZXIpIHtcbiAgdmFyIG1hcEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpO1xuICB2YXIgc2VhcmNoRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkcmVzcy1pbnB1dCcpO1xuXG4gIHRoaXMubWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChtYXBFbCxcbiAgICB7IHpvb206IDE1LCBjZW50ZXI6IGNlbnRlciB9KTtcblxuICBpZiAoIWNlbnRlcikge1xuICAgIHRoaXMuZ2V0Q3VycmVudExvY2F0aW9uKHRoaXMubWFwKTtcbiAgfVxuXG4gIHRoaXMuc2VhcmNoQm94ID0gbmV3IGdvb2dsZS5tYXBzLnBsYWNlcy5TZWFyY2hCb3goc2VhcmNoRWwpO1xuICB0aGlzLnNlYXJjaEJveC5iaW5kVG8oJ2JvdW5kcycsIHRoaXMubWFwKTtcblxuICB0aGlzLnNlYXJjaEJveC5hZGRMaXN0ZW5lcigncGxhY2VzX2NoYW5nZWQnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzdWx0cyA9IHRoaXMuX2FkbWluUmVzdGF1cmFudHNTZXJ2aWNlXG4gICAgICAgIC5zZWFyY2godGhpcy5zZWFyY2hCb3gsIHRoaXMubWFwLCB0aGlzLm1hcmtlcik7XG5cbiAgICB0aGlzLmF1dG9jb21wbGV0ZUZvcm0ocmVzdWx0cyk7XG4gICAgdGhpcy5fJHNjb3BlLiRhcHBseSgpO1xuICB9LmJpbmQodGhpcykpO1xuXG5cbn07XG5cbkFkbWluUmVzdGF1cmFudHNDb250cm9sbGVyLnByb3RvdHlwZS5hdXRvY29tcGxldGVGb3JtID0gZnVuY3Rpb24ocmVzdWx0cykge1xuICB0aGlzLnJlc3RhdXJhbnQubmFtZSAgICAgPSByZXN1bHRzWzBdLm5hbWU7XG4gIHRoaXMucmVzdGF1cmFudC5hZGRyZXNzICA9IHJlc3VsdHNbMF0uZm9ybWF0dGVkX2FkZHJlc3M7XG4gIHRoaXMucmVzdGF1cmFudC5sYXQgICAgICA9IHJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24ubGF0KCk7XG4gIHRoaXMucmVzdGF1cmFudC5sbmcgICAgICA9IHJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24ubG5nKCk7XG59O1xuXG5BZG1pblJlc3RhdXJhbnRzQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0Q3VycmVudExvY2F0aW9uID0gZnVuY3Rpb24obWFwKSB7XG4gIGlmIChuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHtcbiAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uKHBvc2l0aW9uKSB7XG4gICAgICB2YXIgcG9zID0ge1xuICAgICAgICBsYXQ6IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSxcbiAgICAgICAgbG5nOiBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlXG4gICAgICB9O1xuXG4gICAgICBtYXAuc2V0Q2VudGVyKHBvcyk7XG5cbiAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBsb2FkaW5nIGN1cnJlbnQgbG9jYXRpb24uJyk7XG4gICAgfSk7XG4gIH1cbn07XG5cbkFkbWluUmVzdGF1cmFudHNDb250cm9sbGVyLnByb3RvdHlwZS5zdWJtaXROZXdSZXN0YXVyYW50ID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKCd0ZXN0JylcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ldy1yZXN0YXVyYW50LWZvcm0nKS5zdWJtaXQoKTtcbn07XG5cbkFkbWluUmVzdGF1cmFudHNDb250cm9sbGVyLnByb3RvdHlwZS5sb2FkUmVzdGF1cmFudCA9IGZ1bmN0aW9uKGlkKSB7XG4gIHRoaXMuX2FkbWluUmVzdGF1cmFudHNTZXJ2aWNlXG4gICAgLmdldFJlc3RhdXJhbnQoaWQpXG4gICAgLnRoZW4oZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgdGhpcy5yZXN0YXVyYW50ID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgIHZhciBsYXRMbmcgPSB7bGF0OiBwYXJzZUZsb2F0KHRoaXMucmVzdGF1cmFudC5sYXQpLFxuICAgICAgICAgICAgICAgICAgICBsbmc6IHBhcnNlRmxvYXQodGhpcy5yZXN0YXVyYW50LmxuZyl9O1xuXG4gICAgICB0aGlzLm1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICBwb3NpdGlvbjogbGF0TG5nLFxuICAgICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5pbml0TWFwKHRoaXMubWFya2VyLnBvc2l0aW9uKTtcbiAgICAgIHRoaXMubWFya2VyLnNldE1hcCh0aGlzLm1hcCk7XG5cbiAgICB9LmJpbmQodGhpcyksIGZ1bmN0aW9uIGVycm9yKHJlc3BvbnNlKSB7XG4gICAgICBjb25zb2xlLmxvZygnZXJyb3InKTtcbiAgICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQWRtaW5SZXN0YXVyYW50c0NvbnRyb2xsZXI7XG4iLCJ2YXIgQWRtaW5SZXN0YXVyYW50c1NlcnZpY2UgPSBmdW5jdGlvbigkaHR0cCkge1xuICB0aGlzLl8kaHR0cCA9ICRodHRwO1xufTtcblxuQWRtaW5SZXN0YXVyYW50c1NlcnZpY2UucHJvdG90eXBlLnN1Ym1pdE5ld1Jlc3RhdXJhbnQgPSBmdW5jdGlvbihyZXN0YXVyYW50RGF0YSkge1xuICB2YXIgdXJsID0gJy9hcGkvcmVzdGF1cmFudHMvbmV3Lyc7XG5cbiAgcmV0dXJuIHRoaXMuXyRodHRwKHtcbiAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICB1cmw6IHVybCxcbiAgICBkYXRhOiByZXN0YXVyYW50RGF0YVxuICB9KTtcbn07XG5cbkFkbWluUmVzdGF1cmFudHNTZXJ2aWNlLnByb3RvdHlwZS5nZXRSZXN0YXVyYW50ID0gZnVuY3Rpb24ocmVzdGF1cmFudElkKSB7XG4gIHZhciB1cmwgPSAnL2FwaS9yZXN0YXVyYW50cy8nICsgcmVzdGF1cmFudElkICsgJy8nO1xuICBcbiAgcmV0dXJuIHRoaXMuXyRodHRwLmdldCh1cmwpO1xufTtcblxuQWRtaW5SZXN0YXVyYW50c1NlcnZpY2UucHJvdG90eXBlLmdlbmVyYXRlTWFwTWFya2VycyA9IGZ1bmN0aW9uKGxvY2F0aW9ucywgbWFya2VyLCBtYXApIHtcbiAgdmFyIGk7XG4gIHZhciBib3VuZHMgPSBtYXAuZ2V0Qm91bmRzKCk7XG5cbiAgaWYgKG1hcmtlcikge1xuICAgIG1hcmtlci5zZXRNYXAobnVsbCk7XG4gIH1cblxuICBmb3IgKGkgPSAwOyBpIDwgbG9jYXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICBwb3NpdGlvbjogbG9jYXRpb25zW2ldLmdlb21ldHJ5LmxvY2F0aW9uLFxuICAgICAgYW5pbWF0aW9uOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUCxcbiAgICB9KTtcblxuICAgIHNldFRpbWVvdXQodGhpcy5kcm9wTWFya2VyKG1hcmtlciwgaSwgbWFwKSwgaSAqIDEwMCk7XG5cbiAgICBpZiAoYm91bmRzKSB7XG4gICAgICBpZiAobG9jYXRpb25zW2ldLmdlb21ldHJ5LnZpZXdwb3J0KSB7XG4gICAgICAgIGJvdW5kcy51bmlvbihsb2NhdGlvbnNbaV0uZ2VvbWV0cnkudmlld3BvcnQpO1xuICAgICAgfVxuXG4gICAgICBib3VuZHMuZXh0ZW5kKGxvY2F0aW9uc1tpXS5nZW9tZXRyeS5sb2NhdGlvbik7XG4gICAgfVxuICB9XG5cbiAgbWFwLmZpdEJvdW5kcyhib3VuZHMpO1xufTtcblxuQWRtaW5SZXN0YXVyYW50c1NlcnZpY2UucHJvdG90eXBlLnNlYXJjaCA9IGZ1bmN0aW9uKHNlYXJjaEJveCwgbWFwLCBtYXJrZXIpIHtcbiAgdmFyIHJlc3VsdHMgPSBzZWFyY2hCb3guZ2V0UGxhY2VzKCk7XG5cbiAgaWYgKHJlc3VsdHMubGVuZ3RoID09PSAwKSB7XG4gICAgY29uc29sZS5sb2coJ25vdGhpbmcgZm91bmQhJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdGhpcy5nZW5lcmF0ZU1hcE1hcmtlcnMocmVzdWx0cywgbWFya2VyLCBtYXApO1xuXG4gIHJldHVybiByZXN1bHRzO1xufTtcblxuQWRtaW5SZXN0YXVyYW50c1NlcnZpY2UucHJvdG90eXBlLmRyb3BNYXJrZXIgPSBmdW5jdGlvbihtYXJrZXIsIGksIG1hcCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgbWFya2VyLnNldE1hcChtYXApO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFkbWluUmVzdGF1cmFudHNTZXJ2aWNlO1xuIiwidmFyIEFkbWluUmVzdGF1cmFudHNDb250cm9sbGVyID0gcmVxdWlyZSgnLi9hZG1pbi1yZXN0YXVyYW50cy1jb250cm9sbGVyLmpzJyk7XG52YXIgQWRtaW5SZXN0YXVyYW50c1NlcnZpY2UgPSByZXF1aXJlKCcuL2FkbWluLXJlc3RhdXJhbnRzLXNlcnZpY2UuanMnKTtcblxuYW5ndWxhci5tb2R1bGUoJ2FkbWluUmVzdGF1cmFudHMnLCBbXSlcbiAgICAgICAgLnNlcnZpY2UoJ2FkbWluUmVzdGF1cmFudHNTZXJ2aWNlJywgQWRtaW5SZXN0YXVyYW50c1NlcnZpY2UpXG4gICAgICAgIC5jb250cm9sbGVyKCdhZG1pblJlc3RhdXJhbnRzQ29udHJvbGxlcicsIEFkbWluUmVzdGF1cmFudHNDb250cm9sbGVyKTtcbiIsInZhciByZXN0YXVyYW50cyA9IHJlcXVpcmUoJy4vcmVzdGF1cmFudHMvcmVzdGF1cmFudHMuanMnKTtcbnZhciByZXZpZXdzID0gcmVxdWlyZSgnLi9yZXZpZXdzL3Jldmlld3MuanMnKTtcbnZhciBjb21tZW50cyA9IHJlcXVpcmUoJy4vY29tbWVudHMvY29tbWVudHMuanMnKTtcbnZhciBhZG1pblJlc3RhdXJhbnRzID0gcmVxdWlyZSgnLi9hZG1pbi1yZXN0YXVyYW50cy9hZG1pbi1yZXN0YXVyYW50cy5qcycpO1xuXG5cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnbHVuY2hsYWInLCBbICdyZXN0YXVyYW50cycsXG4gICAgICAgICAgICAgICAgICAgICAgICAncmV2aWV3cycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnY29tbWVudHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2FkbWluUmVzdGF1cmFudHMnXG4gICAgICAgICAgICAgICAgICAgICAgXSlcbiAgLmNvbmZpZyhbICckaW50ZXJwb2xhdGVQcm92aWRlcicsXG4gICAgICAgICAgICAnJGh0dHBQcm92aWRlcicsXG4gICAgICAgICAgICAnJHFQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJGludGVycG9sYXRlUHJvdmlkZXIsICRodHRwUHJvdmlkZXIsICRxUHJvdmlkZXIpIHtcbiAgICAgICRpbnRlcnBvbGF0ZVByb3ZpZGVyXG4gICAgICAgIC5zdGFydFN5bWJvbCgne1snKVxuICAgICAgICAuZW5kU3ltYm9sKCddfScpO1xuXG4gICAgICAvLyAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLnhzcmZDb29raWVOYW1lID0gJ2NzcmZ0b2tlbic7XG4gICAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLnhzcmZIZWFkZXJOYW1lID0gJ1hfQ1NSRlRPS0VOJztcblxuICAgICAgLy8gRml4IGVycm9uZW91cyB1bmhhbmRsZWQgZXJyb3IgbG9ncy4uLnRoYW5rcyBhbmd1bGFyIDEuNS45Li4uXG4gICAgICAkcVByb3ZpZGVyLmVycm9yT25VbmhhbmRsZWRSZWplY3Rpb25zKGZhbHNlKTtcbiAgICB9XG4gIF0pLlxuICBydW4oZnVuY3Rpb24gcnVuICgkaHR0cCkge1xuICAgIC8vIEdldCB0aGUgQ1NSRiB0b2tlbiBmcm9tIHRoZSB7JSBjc3JmX3Rva2VuICV9IHRhZ1xuICAgIHZhciBjc3JmX3Rva2VuID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ2NzcmZtaWRkbGV3YXJldG9rZW4nKVswXS52YWx1ZTtcblxuICAgIC8vIEZvciBDU1JGIHRva2VuIGNvbXBhdGliaWxpdHkgd2l0aCBEamFuZ29cbiAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vbltcIlgtQ1NSRlRva2VuXCJdID0gY3NyZl90b2tlbjtcbiAgfSk7XG5cbmFuZ3VsYXIuYm9vdHN0cmFwKGRvY3VtZW50LCBbJ2x1bmNobGFiJ10pO1xuIiwidmFyIENvbW1lbnQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICB0ZW1wbGF0ZVVybDogJy9zdGF0aWMvdGVtcGxhdGVzL2NvbW1lbnRzL2NvbW1lbnQuaHRtbCcsXG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICBzY29wZToge1xuICAgICAgY29tbWVudDogJz1kYXRhJ1xuICAgIH0sXG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbW1lbnQ7XG4iLCJ2YXIgQ29tbWVudHNDb250cm9sbGVyID0gZnVuY3Rpb24oY29tbWVudHNTZXJ2aWNlKSB7XG4gIHRoaXMuX2NvbW1lbnRzU2VydmljZSA9IGNvbW1lbnRzU2VydmljZTtcbiAgdGhpcy5jb21tZW50cyA9IFtdO1xuICB0aGlzLm5ld0NvbW1lbnQgPSB7Ym9keTogJyd9O1xuICB0aGlzLm5ld0NvbW1lbnRFcnJvcnMgPSBbXTtcbiAgdGhpcy5zaG93Q29tbWVudHMgPSBmYWxzZTtcbn07XG5cbkNvbW1lbnRzQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0Q29tbWVudHMgPSBmdW5jdGlvbihyZXZpZXdJZCkge1xuXG4gIHRoaXMuX2NvbW1lbnRzU2VydmljZVxuICAgIC5nZXRDb21tZW50cyhyZXZpZXdJZClcbiAgICAudGhlbihmdW5jdGlvbiBzdWNjZXNzIChyZXNwb25zZSkge1xuICAgICAgdGhpcy5jb21tZW50cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICB0aGlzLnNob3dDb21tZW50cyA9IHRydWU7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cbkNvbW1lbnRzQ29udHJvbGxlci5wcm90b3R5cGUuaGlkZUNvbW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuc2hvd0NvbW1lbnRzID0gZmFsc2U7XG59O1xuXG5Db21tZW50c0NvbnRyb2xsZXIucHJvdG90eXBlLnN1Ym1pdE5ld0NvbW1lbnQgPSBmdW5jdGlvbihyZXZpZXdJZCkge1xuICBpZiAodGhpcy5uZXdDb21tZW50LmJvZHkpIHtcbiAgICB0aGlzLm5ld0NvbW1lbnQucmV2aWV3SWQgPSByZXZpZXdJZDtcbiAgICB0aGlzLl9jb21tZW50c1NlcnZpY2VcbiAgICAgIC5zdWJtaXROZXdDb21tZW50KHRoaXMubmV3Q29tbWVudClcbiAgICAgIC50aGVuKGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgdGhpcy5jb21tZW50cy5wdXNoKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgfS5iaW5kKHRoaXMpLCBmdW5jdGlvbiBlcnJvcihyZXNwb25zZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnRXJyb3Igc3VibWl0dGluZyBuZXcgY29tbWVudC4nKTtcbiAgICAgIH0pO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbW1lbnRzQ29udHJvbGxlcjtcbiIsInZhciBDb21tZW50c1NlcnZpY2UgPSBmdW5jdGlvbigkaHR0cCkge1xuICB0aGlzLl8kaHR0cCA9ICRodHRwO1xufTtcblxuQ29tbWVudHNTZXJ2aWNlLnByb3RvdHlwZS5nZXRDb21tZW50cyA9IGZ1bmN0aW9uKHJldmlld0lkKSB7XG4gIHJldHVybiB0aGlzLl8kaHR0cC5nZXQoJy9hcGkvY29tbWVudHMvP3Jldmlldz0nICsgcmV2aWV3SWQpO1xufTtcblxuQ29tbWVudHNTZXJ2aWNlLnByb3RvdHlwZS5zdWJtaXROZXdDb21tZW50ID0gZnVuY3Rpb24obmV3Q29tbWVudCkge1xuICB2YXIgdXJsID0gJy9hcGkvY29tbWVudHMvbmV3Lz9yZXZpZXc9JyArIG5ld0NvbW1lbnQucmV2aWV3SWQgKyAnLyc7XG5cbiAgcmV0dXJuIHRoaXMuXyRodHRwKHtcbiAgICBtZXRob2QgIDogJ1BPU1QnLFxuICAgIHVybCAgICAgOiB1cmwsXG4gICAgZGF0YSAgICA6IG5ld0NvbW1lbnRcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbW1lbnRzU2VydmljZTtcbiIsInZhciBDb21tZW50c0NvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbW1lbnRzLWNvbnRyb2xsZXIuanMnKTtcbnZhciBDb21tZW50c1NlcnZpY2UgPSByZXF1aXJlKCcuL2NvbW1lbnRzLXNlcnZpY2UuanMnKTtcbnZhciBDb21tZW50ID0gcmVxdWlyZSgnLi9jb21tZW50LmpzJyk7XG5cbmFuZ3VsYXIubW9kdWxlKCdjb21tZW50cycsIFtdKVxuICAgICAgICAuc2VydmljZSgnY29tbWVudHNTZXJ2aWNlJywgQ29tbWVudHNTZXJ2aWNlKVxuICAgICAgICAuY29udHJvbGxlcignY29tbWVudHNDb250cm9sbGVyJywgQ29tbWVudHNDb250cm9sbGVyKVxuICAgICAgICAuZGlyZWN0aXZlKCdjb21tZW50JywgQ29tbWVudCk7XG4iLCJ2YXIgUmVzdGF1cmFudCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHRlbXBsYXRlVXJsOiAnLi9zdGF0aWNmaWxlcy90ZW1wbGF0ZXMvcmVzdGF1cmFudHMvcmVzdGF1cmFudC5odG1sJyxcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHNjb3BlOiB7XG4gICAgICByZXN0YXVyYW50OiAnPWRhdGEnXG4gICAgfVxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZXN0YXVyYW50O1xuIiwidmFyIFJlc3RhdXJhbnRzQ29udHJvbGxlciA9IGZ1bmN0aW9uKHJlc3RhdXJhbnRzU2VydmljZSkge1xuICB0aGlzLl9yZXN0YXVyYW50c1NlcnZpY2UgPSByZXN0YXVyYW50c1NlcnZpY2U7XG4gIHRoaXMudmlzaXRlZCA9IFtdO1xuICB0aGlzLnVudmlzaXRlZCA9IFtdO1xuXG4gIHRoaXMuZ2V0UmVzdGF1cmFudHMoKTtcbn07XG5cblJlc3RhdXJhbnRzQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0UmVzdGF1cmFudHMgPSBmdW5jdGlvbigpIHtcblxuICB0aGlzLl9yZXN0YXVyYW50c1NlcnZpY2VcbiAgICAuZ2V0UmVzdGF1cmFudHMoKVxuICAgIC50aGVuKGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgIHZhciByZXN0YXVyYW50cyA9IHJlc3BvbnNlLmRhdGE7XG5cbiAgICAgIHJlc3RhdXJhbnRzLmZvckVhY2goZnVuY3Rpb24gKHJlc3RhdXJhbnQpIHtcblxuICAgICAgICBpZiAocmVzdGF1cmFudC52aXNpdGVkKSB7XG4gICAgICAgICAgdGhpcy52aXNpdGVkLnB1c2gocmVzdGF1cmFudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy51bnZpc2l0ZWQucHVzaChyZXN0YXVyYW50KTtcbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuUmVzdGF1cmFudHNDb250cm9sbGVyLnByb3RvdHlwZS52aXNpdCA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gIHRoaXMuX3Jlc3RhdXJhbnRzU2VydmljZVxuICAgIC52aXNpdFJlc3RhdXJhbnQodGhpcy51bnZpc2l0ZWRbaW5kZXhdLmlkKVxuICAgIC50aGVuKGZ1bmN0aW9uIHN1Y2Nlc3MoKSB7XG4gICAgICB2YXIgcmVzdGF1cmFudCA9IHRoaXMudW52aXNpdGVkLnNwbGljZShpbmRleCwgMSlbMF07XG5cbiAgICAgIHJlc3RhdXJhbnQudmlzaXRlZCA9IHRydWU7XG4gICAgICB0aGlzLnZpc2l0ZWQucHVzaChyZXN0YXVyYW50KTtcbiAgICB9LmJpbmQodGhpcyksIGZ1bmN0aW9uIGVycm9yKHJlc3BvbnNlKSB7XG4gICAgICBjb25zb2xlLmxvZygnRXJyb3Igb24gdmlzaXQgcG9zdCcpO1xuICAgIH0pO1xufTtcblxuUmVzdGF1cmFudHNDb250cm9sbGVyLnByb3RvdHlwZS50aHVtYnNEb3duID0gZnVuY3Rpb24ocmVzdGF1cmFudExpc3QsIGluZGV4KSB7XG4gIHRoaXMuX3Jlc3RhdXJhbnRzU2VydmljZVxuICAgIC50aHVtYnNEb3duUmVzdGF1cmFudCh0aGlzW3Jlc3RhdXJhbnRMaXN0XVtpbmRleF0uaWQpXG4gICAgLnRoZW4oZnVuY3Rpb24gc3VjY2VzcygpIHtcbiAgICAgIHRoaXNbcmVzdGF1cmFudExpc3RdLnNwbGljZShpbmRleCwgMSk7XG4gICAgfS5iaW5kKHRoaXMpLCBmdW5jdGlvbiBlcnJvcihyZXNwb25zZSkge1xuICAgICAgY29uc29sZS5sb2coJ0Vycm9yIG9uIHRodW1icyBkb3duJyk7XG4gICAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc3RhdXJhbnRzQ29udHJvbGxlcjtcbiIsInZhciBSZXN0YXVyYW50c1NlcnZpY2UgPSBmdW5jdGlvbigkaHR0cCkge1xuICB0aGlzLl8kaHR0cCA9ICRodHRwO1xufTtcblxuUmVzdGF1cmFudHNTZXJ2aWNlLnByb3RvdHlwZS5nZXRSZXN0YXVyYW50cyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5fJGh0dHAuZ2V0KCdhcGkvcmVzdGF1cmFudHMvJyk7XG59O1xuXG5SZXN0YXVyYW50c1NlcnZpY2UucHJvdG90eXBlLnZpc2l0UmVzdGF1cmFudCA9IGZ1bmN0aW9uKGlkKSB7XG4gIHJldHVybiB0aGlzLl8kaHR0cC5wb3N0KCdhcGkvcmVzdGF1cmFudHMvdmlzaXQvJyArIGlkICsgJy8nKTtcbn07XG5cblJlc3RhdXJhbnRzU2VydmljZS5wcm90b3R5cGUudGh1bWJzRG93blJlc3RhdXJhbnQgPSBmdW5jdGlvbihpZCkge1xuICByZXR1cm4gdGhpcy5fJGh0dHBcbiAgICAucG9zdCgnYXBpL3Jlc3RhdXJhbnRzL3RodW1icy1kb3duLycgKyBpZCArICcvJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc3RhdXJhbnRzU2VydmljZTtcbiIsInZhciBSZXN0YXVyYW50c0NvbnRyb2xsZXIgPSByZXF1aXJlKCcuL3Jlc3RhdXJhbnRzLWNvbnRyb2xsZXIuanMnKTtcbnZhciBSZXN0YXVyYW50c1NlcnZpY2UgPSByZXF1aXJlKCcuL3Jlc3RhdXJhbnRzLXNlcnZpY2UuanMnKTtcbnZhciBSZXN0YXVyYW50ID0gcmVxdWlyZSgnLi9yZXN0YXVyYW50LmpzJyk7XG5cbmFuZ3VsYXIubW9kdWxlKCdyZXN0YXVyYW50cycsIFtdKVxuICAgICAgICAuc2VydmljZSgncmVzdGF1cmFudHNTZXJ2aWNlJywgUmVzdGF1cmFudHNTZXJ2aWNlKVxuICAgICAgICAuY29udHJvbGxlcigncmVzdGF1cmFudHNDb250cm9sbGVyJywgUmVzdGF1cmFudHNDb250cm9sbGVyKVxuICAgICAgICAuZGlyZWN0aXZlKCdyZXN0YXVyYW50JywgUmVzdGF1cmFudCk7XG4iLCJ2YXIgUmV2aWV3ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgdGVtcGxhdGVVcmw6ICcvc3RhdGljL3RlbXBsYXRlcy9yZXZpZXdzL3Jldmlldy5odG1sJyxcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHNjb3BlOiB7XG4gICAgICByZXZpZXc6ICc9ZGF0YSdcbiAgICB9LFxuICAgIC8vIGNvbnRyb2xsZXI6ICdyZXZpZXdzQ29udHJvbGxlciBhcyBjdHJsJ1xuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZXZpZXc7XG4iLCJ2YXIgUmV2aWV3c0NvbnRyb2xsZXIgPSBmdW5jdGlvbihyZXZpZXdzU2VydmljZSkge1xuICB0aGlzLl9yZXZpZXdzU2VydmljZSA9IHJldmlld3NTZXJ2aWNlO1xuICB0aGlzLnJldmlld3MgPSBbXTtcbiAgdGhpcy5yZXN0YXVyYW50SWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudC1pZCcpLnZhbHVlO1xuICB0aGlzLm5ld1JldmlldyA9IHt0aXRsZTogJycsIGJvZHk6ICcnLCByZXN0YXVyYW50SWQ6IHRoaXMucmVzdGF1cmFudElkfTtcbiAgdGhpcy5uZXdSZXZpZXdFcnJvcnMgPSBbXTtcbiAgdGhpcy5nZXRSZXZpZXdzKHRoaXMucmVzdGF1cmFudElkKTtcbn07XG5cblJldmlld3NDb250cm9sbGVyLnByb3RvdHlwZS5nZXRSZXZpZXdzID0gZnVuY3Rpb24ocmVzdGF1cmFudElkKSB7XG4gIHRoaXMuX3Jldmlld3NTZXJ2aWNlXG4gICAgLmdldFJldmlld3MocmVzdGF1cmFudElkKVxuICAgIC50aGVuKGZ1bmN0aW9uIHN1Y2Nlc3MgKHJlc3BvbnNlKSB7XG5cbiAgICAgIHRoaXMucmV2aWV3cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cblJldmlld3NDb250cm9sbGVyLnByb3RvdHlwZS5zdWJtaXROZXdSZXZpZXcgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMubmV3UmV2aWV3LnRpdGxlICYmIHRoaXMubmV3UmV2aWV3LmJvZHkpIHtcbiAgICB0aGlzLl9yZXZpZXdzU2VydmljZVxuICAgICAgLnN1Ym1pdE5ld1Jldmlldyh0aGlzLm5ld1JldmlldylcbiAgICAgIC50aGVuKGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgdGhpcy5yZXZpZXdzLnB1c2gocmVzcG9uc2UuZGF0YSk7XG4gICAgICB9LmJpbmQodGhpcyksIGZ1bmN0aW9uIGVycm9yKHJlc3BvbnNlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBzdWJtaXR0aW5nIG5ldyByZXZpZXcuJyk7XG4gICAgICB9KTtcbiAgfVxufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFJldmlld3NDb250cm9sbGVyO1xuIiwidmFyIFJldmlld3NTZXJ2aWNlID0gZnVuY3Rpb24oJGh0dHApIHtcbiAgdGhpcy5fJGh0dHAgPSAkaHR0cDtcbn07XG5cblJldmlld3NTZXJ2aWNlLnByb3RvdHlwZS5nZXRSZXZpZXdzID0gZnVuY3Rpb24ocmVzdGF1cmFudElkKSB7XG4gIHJldHVybiB0aGlzLl8kaHR0cC5nZXQoJy9hcGkvcmV2aWV3cy8/cmVzdGF1cmFudD0nICsgcmVzdGF1cmFudElkKTtcbn07XG5cblJldmlld3NTZXJ2aWNlLnByb3RvdHlwZS5zdWJtaXROZXdSZXZpZXcgPSBmdW5jdGlvbihuZXdSZXZpZXcpIHtcbiAgdmFyIHVybCA9ICcvYXBpL3Jldmlld3MvbmV3Lz9yZXN0YXVyYW50PScgKyBuZXdSZXZpZXcucmVzdGF1cmFudElkICsgJy8nO1xuICBcbiAgcmV0dXJuIHRoaXMuXyRodHRwKHtcbiAgICBtZXRob2QgIDogJ1BPU1QnLFxuICAgIHVybCAgICAgOiB1cmwsXG4gICAgZGF0YSAgICA6IG5ld1Jldmlld1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmV2aWV3c1NlcnZpY2U7XG4iLCJ2YXIgUmV2aWV3c0NvbnRyb2xsZXIgPSByZXF1aXJlKCcuL3Jldmlld3MtY29udHJvbGxlci5qcycpO1xudmFyIFJldmlld3NTZXJ2aWNlID0gcmVxdWlyZSgnLi9yZXZpZXdzLXNlcnZpY2UuanMnKTtcbnZhciBSZXZpZXcgPSByZXF1aXJlKCcuL3Jldmlldy5qcycpO1xuXG5hbmd1bGFyLm1vZHVsZSgncmV2aWV3cycsIFtdKVxuICAgICAgICAuc2VydmljZSgncmV2aWV3c1NlcnZpY2UnLCBSZXZpZXdzU2VydmljZSlcbiAgICAgICAgLmNvbnRyb2xsZXIoJ3Jldmlld3NDb250cm9sbGVyJywgUmV2aWV3c0NvbnRyb2xsZXIpXG4gICAgICAgIC5kaXJlY3RpdmUoJ3JldmlldycsIFJldmlldyk7XG4iXX0=
