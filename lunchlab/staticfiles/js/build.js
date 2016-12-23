(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var AdminRestaurantsController = function(adminRestaurantsService, $timeout, $scope) {
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
    this.initMap(this.getCurrentLocation());
  }
};

AdminRestaurantsController.prototype.initMap = function(center) {
  var mapEl = document.getElementById('map');
  var searchEl = document.getElementById('address-input');

  this.map = new google.maps.Map(mapEl,
    { zoom: 15, center: center });

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

      return pos;

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
    templateUrl: './static/templates/restaurants/restaurant.html',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvanMvYWRtaW4tcmVzdGF1cmFudHMvYWRtaW4tcmVzdGF1cmFudHMtY29udHJvbGxlci5qcyIsImNsaWVudC9qcy9hZG1pbi1yZXN0YXVyYW50cy9hZG1pbi1yZXN0YXVyYW50cy1zZXJ2aWNlLmpzIiwiY2xpZW50L2pzL2FkbWluLXJlc3RhdXJhbnRzL2FkbWluLXJlc3RhdXJhbnRzLmpzIiwiY2xpZW50L2pzL2FwcC5qcyIsImNsaWVudC9qcy9jb21tZW50cy9jb21tZW50LmpzIiwiY2xpZW50L2pzL2NvbW1lbnRzL2NvbW1lbnRzLWNvbnRyb2xsZXIuanMiLCJjbGllbnQvanMvY29tbWVudHMvY29tbWVudHMtc2VydmljZS5qcyIsImNsaWVudC9qcy9jb21tZW50cy9jb21tZW50cy5qcyIsImNsaWVudC9qcy9yZXN0YXVyYW50cy9yZXN0YXVyYW50LmpzIiwiY2xpZW50L2pzL3Jlc3RhdXJhbnRzL3Jlc3RhdXJhbnRzLWNvbnRyb2xsZXIuanMiLCJjbGllbnQvanMvcmVzdGF1cmFudHMvcmVzdGF1cmFudHMtc2VydmljZS5qcyIsImNsaWVudC9qcy9yZXN0YXVyYW50cy9yZXN0YXVyYW50cy5qcyIsImNsaWVudC9qcy9yZXZpZXdzL3Jldmlldy5qcyIsImNsaWVudC9qcy9yZXZpZXdzL3Jldmlld3MtY29udHJvbGxlci5qcyIsImNsaWVudC9qcy9yZXZpZXdzL3Jldmlld3Mtc2VydmljZS5qcyIsImNsaWVudC9qcy9yZXZpZXdzL3Jldmlld3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgQWRtaW5SZXN0YXVyYW50c0NvbnRyb2xsZXIgPSBmdW5jdGlvbihhZG1pblJlc3RhdXJhbnRzU2VydmljZSwgJHRpbWVvdXQsICRzY29wZSkge1xuICB0aGlzLl9hZG1pblJlc3RhdXJhbnRzU2VydmljZSA9IGFkbWluUmVzdGF1cmFudHNTZXJ2aWNlO1xuICB0aGlzLl8kc2NvcGUgPSAkc2NvcGU7XG4gIHRoaXMubWFwID0gdW5kZWZpbmVkO1xuICB0aGlzLnNlYXJjaEJveCA9IHVuZGVmaW5lZDtcbiAgdGhpcy5yZXN0YXVyYW50SWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgncmVzdGF1cmFudC1pZCcpWzBdLnZhbHVlO1xuICB0aGlzLm1hcmtlcjtcbiAgdGhpcy5yZXN0YXVyYW50ID0ge307XG5cbiAgaWYgKHRoaXMucmVzdGF1cmFudElkKSB7XG4gICAgdGhpcy5sb2FkUmVzdGF1cmFudCh0aGlzLnJlc3RhdXJhbnRJZCk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5pbml0TWFwKHRoaXMuZ2V0Q3VycmVudExvY2F0aW9uKCkpO1xuICB9XG59O1xuXG5BZG1pblJlc3RhdXJhbnRzQ29udHJvbGxlci5wcm90b3R5cGUuaW5pdE1hcCA9IGZ1bmN0aW9uKGNlbnRlcikge1xuICB2YXIgbWFwRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJyk7XG4gIHZhciBzZWFyY2hFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRyZXNzLWlucHV0Jyk7XG5cbiAgdGhpcy5tYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKG1hcEVsLFxuICAgIHsgem9vbTogMTUsIGNlbnRlcjogY2VudGVyIH0pO1xuXG4gIHRoaXMuc2VhcmNoQm94ID0gbmV3IGdvb2dsZS5tYXBzLnBsYWNlcy5TZWFyY2hCb3goc2VhcmNoRWwpO1xuICB0aGlzLnNlYXJjaEJveC5iaW5kVG8oJ2JvdW5kcycsIHRoaXMubWFwKTtcblxuICB0aGlzLnNlYXJjaEJveC5hZGRMaXN0ZW5lcigncGxhY2VzX2NoYW5nZWQnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzdWx0cyA9IHRoaXMuX2FkbWluUmVzdGF1cmFudHNTZXJ2aWNlXG4gICAgICAgIC5zZWFyY2godGhpcy5zZWFyY2hCb3gsIHRoaXMubWFwLCB0aGlzLm1hcmtlcik7XG5cbiAgICB0aGlzLmF1dG9jb21wbGV0ZUZvcm0ocmVzdWx0cyk7XG4gICAgdGhpcy5fJHNjb3BlLiRhcHBseSgpO1xuICB9LmJpbmQodGhpcykpO1xuXG5cbn07XG5cbkFkbWluUmVzdGF1cmFudHNDb250cm9sbGVyLnByb3RvdHlwZS5hdXRvY29tcGxldGVGb3JtID0gZnVuY3Rpb24ocmVzdWx0cykge1xuICB0aGlzLnJlc3RhdXJhbnQubmFtZSAgICAgPSByZXN1bHRzWzBdLm5hbWU7XG4gIHRoaXMucmVzdGF1cmFudC5hZGRyZXNzICA9IHJlc3VsdHNbMF0uZm9ybWF0dGVkX2FkZHJlc3M7XG4gIHRoaXMucmVzdGF1cmFudC5sYXQgICAgICA9IHJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24ubGF0KCk7XG4gIHRoaXMucmVzdGF1cmFudC5sbmcgICAgICA9IHJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24ubG5nKCk7XG59O1xuXG5BZG1pblJlc3RhdXJhbnRzQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0Q3VycmVudExvY2F0aW9uID0gZnVuY3Rpb24obWFwKSB7XG4gIGlmIChuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHtcbiAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uKHBvc2l0aW9uKSB7XG4gICAgICB2YXIgcG9zID0ge1xuICAgICAgICBsYXQ6IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSxcbiAgICAgICAgbG5nOiBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlXG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gcG9zO1xuXG4gICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zb2xlLmxvZygnRXJyb3IgbG9hZGluZyBjdXJyZW50IGxvY2F0aW9uLicpO1xuICAgIH0pO1xuICB9XG59O1xuXG5BZG1pblJlc3RhdXJhbnRzQ29udHJvbGxlci5wcm90b3R5cGUuc3VibWl0TmV3UmVzdGF1cmFudCA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygndGVzdCcpXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctcmVzdGF1cmFudC1mb3JtJykuc3VibWl0KCk7XG59O1xuXG5BZG1pblJlc3RhdXJhbnRzQ29udHJvbGxlci5wcm90b3R5cGUubG9hZFJlc3RhdXJhbnQgPSBmdW5jdGlvbihpZCkge1xuICB0aGlzLl9hZG1pblJlc3RhdXJhbnRzU2VydmljZVxuICAgIC5nZXRSZXN0YXVyYW50KGlkKVxuICAgIC50aGVuKGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgIHRoaXMucmVzdGF1cmFudCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICB2YXIgbGF0TG5nID0ge2xhdDogcGFyc2VGbG9hdCh0aGlzLnJlc3RhdXJhbnQubGF0KSxcbiAgICAgICAgICAgICAgICAgICAgbG5nOiBwYXJzZUZsb2F0KHRoaXMucmVzdGF1cmFudC5sbmcpfTtcblxuICAgICAgdGhpcy5tYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgcG9zaXRpb246IGxhdExuZyxcbiAgICAgICAgYW5pbWF0aW9uOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUFxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuaW5pdE1hcCh0aGlzLm1hcmtlci5wb3NpdGlvbik7XG4gICAgICB0aGlzLm1hcmtlci5zZXRNYXAodGhpcy5tYXApO1xuXG4gICAgfS5iaW5kKHRoaXMpLCBmdW5jdGlvbiBlcnJvcihyZXNwb25zZSkge1xuICAgICAgY29uc29sZS5sb2coJ2Vycm9yJyk7XG4gICAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFkbWluUmVzdGF1cmFudHNDb250cm9sbGVyO1xuIiwidmFyIEFkbWluUmVzdGF1cmFudHNTZXJ2aWNlID0gZnVuY3Rpb24oJGh0dHApIHtcbiAgdGhpcy5fJGh0dHAgPSAkaHR0cDtcbn07XG5cbkFkbWluUmVzdGF1cmFudHNTZXJ2aWNlLnByb3RvdHlwZS5zdWJtaXROZXdSZXN0YXVyYW50ID0gZnVuY3Rpb24ocmVzdGF1cmFudERhdGEpIHtcbiAgdmFyIHVybCA9ICcvYXBpL3Jlc3RhdXJhbnRzL25ldy8nO1xuXG4gIHJldHVybiB0aGlzLl8kaHR0cCh7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgdXJsOiB1cmwsXG4gICAgZGF0YTogcmVzdGF1cmFudERhdGFcbiAgfSk7XG59O1xuXG5BZG1pblJlc3RhdXJhbnRzU2VydmljZS5wcm90b3R5cGUuZ2V0UmVzdGF1cmFudCA9IGZ1bmN0aW9uKHJlc3RhdXJhbnRJZCkge1xuICB2YXIgdXJsID0gJy9hcGkvcmVzdGF1cmFudHMvJyArIHJlc3RhdXJhbnRJZCArICcvJztcbiAgXG4gIHJldHVybiB0aGlzLl8kaHR0cC5nZXQodXJsKTtcbn07XG5cbkFkbWluUmVzdGF1cmFudHNTZXJ2aWNlLnByb3RvdHlwZS5nZW5lcmF0ZU1hcE1hcmtlcnMgPSBmdW5jdGlvbihsb2NhdGlvbnMsIG1hcmtlciwgbWFwKSB7XG4gIHZhciBpO1xuICB2YXIgYm91bmRzID0gbWFwLmdldEJvdW5kcygpO1xuXG4gIGlmIChtYXJrZXIpIHtcbiAgICBtYXJrZXIuc2V0TWFwKG51bGwpO1xuICB9XG5cbiAgZm9yIChpID0gMDsgaSA8IGxvY2F0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgcG9zaXRpb246IGxvY2F0aW9uc1tpXS5nZW9tZXRyeS5sb2NhdGlvbixcbiAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1AsXG4gICAgfSk7XG5cbiAgICBzZXRUaW1lb3V0KHRoaXMuZHJvcE1hcmtlcihtYXJrZXIsIGksIG1hcCksIGkgKiAxMDApO1xuXG4gICAgaWYgKGJvdW5kcykge1xuICAgICAgaWYgKGxvY2F0aW9uc1tpXS5nZW9tZXRyeS52aWV3cG9ydCkge1xuICAgICAgICBib3VuZHMudW5pb24obG9jYXRpb25zW2ldLmdlb21ldHJ5LnZpZXdwb3J0KTtcbiAgICAgIH1cblxuICAgICAgYm91bmRzLmV4dGVuZChsb2NhdGlvbnNbaV0uZ2VvbWV0cnkubG9jYXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIG1hcC5maXRCb3VuZHMoYm91bmRzKTtcbn07XG5cbkFkbWluUmVzdGF1cmFudHNTZXJ2aWNlLnByb3RvdHlwZS5zZWFyY2ggPSBmdW5jdGlvbihzZWFyY2hCb3gsIG1hcCwgbWFya2VyKSB7XG4gIHZhciByZXN1bHRzID0gc2VhcmNoQm94LmdldFBsYWNlcygpO1xuXG4gIGlmIChyZXN1bHRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGNvbnNvbGUubG9nKCdub3RoaW5nIGZvdW5kIScpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHRoaXMuZ2VuZXJhdGVNYXBNYXJrZXJzKHJlc3VsdHMsIG1hcmtlciwgbWFwKTtcblxuICByZXR1cm4gcmVzdWx0cztcbn07XG5cbkFkbWluUmVzdGF1cmFudHNTZXJ2aWNlLnByb3RvdHlwZS5kcm9wTWFya2VyID0gZnVuY3Rpb24obWFya2VyLCBpLCBtYXApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIG1hcmtlci5zZXRNYXAobWFwKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBZG1pblJlc3RhdXJhbnRzU2VydmljZTtcbiIsInZhciBBZG1pblJlc3RhdXJhbnRzQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vYWRtaW4tcmVzdGF1cmFudHMtY29udHJvbGxlci5qcycpO1xudmFyIEFkbWluUmVzdGF1cmFudHNTZXJ2aWNlID0gcmVxdWlyZSgnLi9hZG1pbi1yZXN0YXVyYW50cy1zZXJ2aWNlLmpzJyk7XG5cbmFuZ3VsYXIubW9kdWxlKCdhZG1pblJlc3RhdXJhbnRzJywgW10pXG4gICAgICAgIC5zZXJ2aWNlKCdhZG1pblJlc3RhdXJhbnRzU2VydmljZScsIEFkbWluUmVzdGF1cmFudHNTZXJ2aWNlKVxuICAgICAgICAuY29udHJvbGxlcignYWRtaW5SZXN0YXVyYW50c0NvbnRyb2xsZXInLCBBZG1pblJlc3RhdXJhbnRzQ29udHJvbGxlcik7XG4iLCJ2YXIgcmVzdGF1cmFudHMgPSByZXF1aXJlKCcuL3Jlc3RhdXJhbnRzL3Jlc3RhdXJhbnRzLmpzJyk7XG52YXIgcmV2aWV3cyA9IHJlcXVpcmUoJy4vcmV2aWV3cy9yZXZpZXdzLmpzJyk7XG52YXIgY29tbWVudHMgPSByZXF1aXJlKCcuL2NvbW1lbnRzL2NvbW1lbnRzLmpzJyk7XG52YXIgYWRtaW5SZXN0YXVyYW50cyA9IHJlcXVpcmUoJy4vYWRtaW4tcmVzdGF1cmFudHMvYWRtaW4tcmVzdGF1cmFudHMuanMnKTtcblxuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2x1bmNobGFiJywgWyAncmVzdGF1cmFudHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3Jldmlld3MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbW1lbnRzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdhZG1pblJlc3RhdXJhbnRzJ1xuICAgICAgICAgICAgICAgICAgICAgIF0pXG4gIC5jb25maWcoWyAnJGludGVycG9sYXRlUHJvdmlkZXInLFxuICAgICAgICAgICAgJyRodHRwUHJvdmlkZXInLFxuICAgICAgICAgICAgJyRxUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRpbnRlcnBvbGF0ZVByb3ZpZGVyLCAkaHR0cFByb3ZpZGVyLCAkcVByb3ZpZGVyKSB7XG4gICAgICAkaW50ZXJwb2xhdGVQcm92aWRlclxuICAgICAgICAuc3RhcnRTeW1ib2woJ3tbJylcbiAgICAgICAgLmVuZFN5bWJvbCgnXX0nKTtcblxuICAgICAgLy8gJGh0dHBQcm92aWRlci5kZWZhdWx0cy54c3JmQ29va2llTmFtZSA9ICdjc3JmdG9rZW4nO1xuICAgICAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy54c3JmSGVhZGVyTmFtZSA9ICdYX0NTUkZUT0tFTic7XG5cbiAgICAgIC8vIEZpeCBlcnJvbmVvdXMgdW5oYW5kbGVkIGVycm9yIGxvZ3MuLi50aGFua3MgYW5ndWxhciAxLjUuOS4uLlxuICAgICAgJHFQcm92aWRlci5lcnJvck9uVW5oYW5kbGVkUmVqZWN0aW9ucyhmYWxzZSk7XG4gICAgfVxuICBdKS5cbiAgcnVuKGZ1bmN0aW9uIHJ1biAoJGh0dHApIHtcbiAgICAvLyBHZXQgdGhlIENTUkYgdG9rZW4gZnJvbSB0aGUgeyUgY3NyZl90b2tlbiAlfSB0YWdcbiAgICB2YXIgY3NyZl90b2tlbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdjc3JmbWlkZGxld2FyZXRva2VuJylbMF0udmFsdWU7XG5cbiAgICAvLyBGb3IgQ1NSRiB0b2tlbiBjb21wYXRpYmlsaXR5IHdpdGggRGphbmdvXG4gICAgJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bXCJYLUNTUkZUb2tlblwiXSA9IGNzcmZfdG9rZW47XG4gIH0pO1xuXG5hbmd1bGFyLmJvb3RzdHJhcChkb2N1bWVudCwgWydsdW5jaGxhYiddKTtcbiIsInZhciBDb21tZW50ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgdGVtcGxhdGVVcmw6ICcvc3RhdGljL3RlbXBsYXRlcy9jb21tZW50cy9jb21tZW50Lmh0bWwnLFxuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgc2NvcGU6IHtcbiAgICAgIGNvbW1lbnQ6ICc9ZGF0YSdcbiAgICB9LFxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb21tZW50O1xuIiwidmFyIENvbW1lbnRzQ29udHJvbGxlciA9IGZ1bmN0aW9uKGNvbW1lbnRzU2VydmljZSkge1xuICB0aGlzLl9jb21tZW50c1NlcnZpY2UgPSBjb21tZW50c1NlcnZpY2U7XG4gIHRoaXMuY29tbWVudHMgPSBbXTtcbiAgdGhpcy5uZXdDb21tZW50ID0ge2JvZHk6ICcnfTtcbiAgdGhpcy5uZXdDb21tZW50RXJyb3JzID0gW107XG4gIHRoaXMuc2hvd0NvbW1lbnRzID0gZmFsc2U7XG59O1xuXG5Db21tZW50c0NvbnRyb2xsZXIucHJvdG90eXBlLmdldENvbW1lbnRzID0gZnVuY3Rpb24ocmV2aWV3SWQpIHtcblxuICB0aGlzLl9jb21tZW50c1NlcnZpY2VcbiAgICAuZ2V0Q29tbWVudHMocmV2aWV3SWQpXG4gICAgLnRoZW4oZnVuY3Rpb24gc3VjY2VzcyAocmVzcG9uc2UpIHtcbiAgICAgIHRoaXMuY29tbWVudHMgPSByZXNwb25zZS5kYXRhO1xuICAgICAgdGhpcy5zaG93Q29tbWVudHMgPSB0cnVlO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5Db21tZW50c0NvbnRyb2xsZXIucHJvdG90eXBlLmhpZGVDb21tZW50cyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnNob3dDb21tZW50cyA9IGZhbHNlO1xufTtcblxuQ29tbWVudHNDb250cm9sbGVyLnByb3RvdHlwZS5zdWJtaXROZXdDb21tZW50ID0gZnVuY3Rpb24ocmV2aWV3SWQpIHtcbiAgaWYgKHRoaXMubmV3Q29tbWVudC5ib2R5KSB7XG4gICAgdGhpcy5uZXdDb21tZW50LnJldmlld0lkID0gcmV2aWV3SWQ7XG4gICAgdGhpcy5fY29tbWVudHNTZXJ2aWNlXG4gICAgICAuc3VibWl0TmV3Q29tbWVudCh0aGlzLm5ld0NvbW1lbnQpXG4gICAgICAudGhlbihmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgIHRoaXMuY29tbWVudHMucHVzaChyZXNwb25zZS5kYXRhKTtcbiAgICAgIH0uYmluZCh0aGlzKSwgZnVuY3Rpb24gZXJyb3IocmVzcG9uc2UpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIHN1Ym1pdHRpbmcgbmV3IGNvbW1lbnQuJyk7XG4gICAgICB9KTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb21tZW50c0NvbnRyb2xsZXI7XG4iLCJ2YXIgQ29tbWVudHNTZXJ2aWNlID0gZnVuY3Rpb24oJGh0dHApIHtcbiAgdGhpcy5fJGh0dHAgPSAkaHR0cDtcbn07XG5cbkNvbW1lbnRzU2VydmljZS5wcm90b3R5cGUuZ2V0Q29tbWVudHMgPSBmdW5jdGlvbihyZXZpZXdJZCkge1xuICByZXR1cm4gdGhpcy5fJGh0dHAuZ2V0KCcvYXBpL2NvbW1lbnRzLz9yZXZpZXc9JyArIHJldmlld0lkKTtcbn07XG5cbkNvbW1lbnRzU2VydmljZS5wcm90b3R5cGUuc3VibWl0TmV3Q29tbWVudCA9IGZ1bmN0aW9uKG5ld0NvbW1lbnQpIHtcbiAgdmFyIHVybCA9ICcvYXBpL2NvbW1lbnRzL25ldy8/cmV2aWV3PScgKyBuZXdDb21tZW50LnJldmlld0lkICsgJy8nO1xuXG4gIHJldHVybiB0aGlzLl8kaHR0cCh7XG4gICAgbWV0aG9kICA6ICdQT1NUJyxcbiAgICB1cmwgICAgIDogdXJsLFxuICAgIGRhdGEgICAgOiBuZXdDb21tZW50XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb21tZW50c1NlcnZpY2U7XG4iLCJ2YXIgQ29tbWVudHNDb250cm9sbGVyID0gcmVxdWlyZSgnLi9jb21tZW50cy1jb250cm9sbGVyLmpzJyk7XG52YXIgQ29tbWVudHNTZXJ2aWNlID0gcmVxdWlyZSgnLi9jb21tZW50cy1zZXJ2aWNlLmpzJyk7XG52YXIgQ29tbWVudCA9IHJlcXVpcmUoJy4vY29tbWVudC5qcycpO1xuXG5hbmd1bGFyLm1vZHVsZSgnY29tbWVudHMnLCBbXSlcbiAgICAgICAgLnNlcnZpY2UoJ2NvbW1lbnRzU2VydmljZScsIENvbW1lbnRzU2VydmljZSlcbiAgICAgICAgLmNvbnRyb2xsZXIoJ2NvbW1lbnRzQ29udHJvbGxlcicsIENvbW1lbnRzQ29udHJvbGxlcilcbiAgICAgICAgLmRpcmVjdGl2ZSgnY29tbWVudCcsIENvbW1lbnQpO1xuIiwidmFyIFJlc3RhdXJhbnQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICB0ZW1wbGF0ZVVybDogJy4vc3RhdGljL3RlbXBsYXRlcy9yZXN0YXVyYW50cy9yZXN0YXVyYW50Lmh0bWwnLFxuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgc2NvcGU6IHtcbiAgICAgIHJlc3RhdXJhbnQ6ICc9ZGF0YSdcbiAgICB9XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc3RhdXJhbnQ7XG4iLCJ2YXIgUmVzdGF1cmFudHNDb250cm9sbGVyID0gZnVuY3Rpb24ocmVzdGF1cmFudHNTZXJ2aWNlKSB7XG4gIHRoaXMuX3Jlc3RhdXJhbnRzU2VydmljZSA9IHJlc3RhdXJhbnRzU2VydmljZTtcbiAgdGhpcy52aXNpdGVkID0gW107XG4gIHRoaXMudW52aXNpdGVkID0gW107XG5cbiAgdGhpcy5nZXRSZXN0YXVyYW50cygpO1xufTtcblxuUmVzdGF1cmFudHNDb250cm9sbGVyLnByb3RvdHlwZS5nZXRSZXN0YXVyYW50cyA9IGZ1bmN0aW9uKCkge1xuXG4gIHRoaXMuX3Jlc3RhdXJhbnRzU2VydmljZVxuICAgIC5nZXRSZXN0YXVyYW50cygpXG4gICAgLnRoZW4oZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgdmFyIHJlc3RhdXJhbnRzID0gcmVzcG9uc2UuZGF0YTtcblxuICAgICAgcmVzdGF1cmFudHMuZm9yRWFjaChmdW5jdGlvbiAocmVzdGF1cmFudCkge1xuXG4gICAgICAgIGlmIChyZXN0YXVyYW50LnZpc2l0ZWQpIHtcbiAgICAgICAgICB0aGlzLnZpc2l0ZWQucHVzaChyZXN0YXVyYW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnVudmlzaXRlZC5wdXNoKHJlc3RhdXJhbnQpO1xuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcykpO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5SZXN0YXVyYW50c0NvbnRyb2xsZXIucHJvdG90eXBlLnZpc2l0ID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgdGhpcy5fcmVzdGF1cmFudHNTZXJ2aWNlXG4gICAgLnZpc2l0UmVzdGF1cmFudCh0aGlzLnVudmlzaXRlZFtpbmRleF0uaWQpXG4gICAgLnRoZW4oZnVuY3Rpb24gc3VjY2VzcygpIHtcbiAgICAgIHZhciByZXN0YXVyYW50ID0gdGhpcy51bnZpc2l0ZWQuc3BsaWNlKGluZGV4LCAxKVswXTtcblxuICAgICAgcmVzdGF1cmFudC52aXNpdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMudmlzaXRlZC5wdXNoKHJlc3RhdXJhbnQpO1xuICAgIH0uYmluZCh0aGlzKSwgZnVuY3Rpb24gZXJyb3IocmVzcG9uc2UpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBvbiB2aXNpdCBwb3N0Jyk7XG4gICAgfSk7XG59O1xuXG5SZXN0YXVyYW50c0NvbnRyb2xsZXIucHJvdG90eXBlLnRodW1ic0Rvd24gPSBmdW5jdGlvbihyZXN0YXVyYW50TGlzdCwgaW5kZXgpIHtcbiAgdGhpcy5fcmVzdGF1cmFudHNTZXJ2aWNlXG4gICAgLnRodW1ic0Rvd25SZXN0YXVyYW50KHRoaXNbcmVzdGF1cmFudExpc3RdW2luZGV4XS5pZClcbiAgICAudGhlbihmdW5jdGlvbiBzdWNjZXNzKCkge1xuICAgICAgdGhpc1tyZXN0YXVyYW50TGlzdF0uc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9LmJpbmQodGhpcyksIGZ1bmN0aW9uIGVycm9yKHJlc3BvbnNlKSB7XG4gICAgICBjb25zb2xlLmxvZygnRXJyb3Igb24gdGh1bWJzIGRvd24nKTtcbiAgICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzdGF1cmFudHNDb250cm9sbGVyO1xuIiwidmFyIFJlc3RhdXJhbnRzU2VydmljZSA9IGZ1bmN0aW9uKCRodHRwKSB7XG4gIHRoaXMuXyRodHRwID0gJGh0dHA7XG59O1xuXG5SZXN0YXVyYW50c1NlcnZpY2UucHJvdG90eXBlLmdldFJlc3RhdXJhbnRzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLl8kaHR0cC5nZXQoJ2FwaS9yZXN0YXVyYW50cy8nKTtcbn07XG5cblJlc3RhdXJhbnRzU2VydmljZS5wcm90b3R5cGUudmlzaXRSZXN0YXVyYW50ID0gZnVuY3Rpb24oaWQpIHtcbiAgcmV0dXJuIHRoaXMuXyRodHRwLnBvc3QoJ2FwaS9yZXN0YXVyYW50cy92aXNpdC8nICsgaWQgKyAnLycpO1xufTtcblxuUmVzdGF1cmFudHNTZXJ2aWNlLnByb3RvdHlwZS50aHVtYnNEb3duUmVzdGF1cmFudCA9IGZ1bmN0aW9uKGlkKSB7XG4gIHJldHVybiB0aGlzLl8kaHR0cFxuICAgIC5wb3N0KCdhcGkvcmVzdGF1cmFudHMvdGh1bWJzLWRvd24vJyArIGlkICsgJy8nKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzdGF1cmFudHNTZXJ2aWNlO1xuIiwidmFyIFJlc3RhdXJhbnRzQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vcmVzdGF1cmFudHMtY29udHJvbGxlci5qcycpO1xudmFyIFJlc3RhdXJhbnRzU2VydmljZSA9IHJlcXVpcmUoJy4vcmVzdGF1cmFudHMtc2VydmljZS5qcycpO1xudmFyIFJlc3RhdXJhbnQgPSByZXF1aXJlKCcuL3Jlc3RhdXJhbnQuanMnKTtcblxuYW5ndWxhci5tb2R1bGUoJ3Jlc3RhdXJhbnRzJywgW10pXG4gICAgICAgIC5zZXJ2aWNlKCdyZXN0YXVyYW50c1NlcnZpY2UnLCBSZXN0YXVyYW50c1NlcnZpY2UpXG4gICAgICAgIC5jb250cm9sbGVyKCdyZXN0YXVyYW50c0NvbnRyb2xsZXInLCBSZXN0YXVyYW50c0NvbnRyb2xsZXIpXG4gICAgICAgIC5kaXJlY3RpdmUoJ3Jlc3RhdXJhbnQnLCBSZXN0YXVyYW50KTtcbiIsInZhciBSZXZpZXcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICB0ZW1wbGF0ZVVybDogJy9zdGF0aWMvdGVtcGxhdGVzL3Jldmlld3MvcmV2aWV3Lmh0bWwnLFxuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgc2NvcGU6IHtcbiAgICAgIHJldmlldzogJz1kYXRhJ1xuICAgIH0sXG4gICAgLy8gY29udHJvbGxlcjogJ3Jldmlld3NDb250cm9sbGVyIGFzIGN0cmwnXG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJldmlldztcbiIsInZhciBSZXZpZXdzQ29udHJvbGxlciA9IGZ1bmN0aW9uKHJldmlld3NTZXJ2aWNlKSB7XG4gIHRoaXMuX3Jldmlld3NTZXJ2aWNlID0gcmV2aWV3c1NlcnZpY2U7XG4gIHRoaXMucmV2aWV3cyA9IFtdO1xuICB0aGlzLnJlc3RhdXJhbnRJZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50LWlkJykudmFsdWU7XG4gIHRoaXMubmV3UmV2aWV3ID0ge3RpdGxlOiAnJywgYm9keTogJycsIHJlc3RhdXJhbnRJZDogdGhpcy5yZXN0YXVyYW50SWR9O1xuICB0aGlzLm5ld1Jldmlld0Vycm9ycyA9IFtdO1xuICB0aGlzLmdldFJldmlld3ModGhpcy5yZXN0YXVyYW50SWQpO1xufTtcblxuUmV2aWV3c0NvbnRyb2xsZXIucHJvdG90eXBlLmdldFJldmlld3MgPSBmdW5jdGlvbihyZXN0YXVyYW50SWQpIHtcbiAgdGhpcy5fcmV2aWV3c1NlcnZpY2VcbiAgICAuZ2V0UmV2aWV3cyhyZXN0YXVyYW50SWQpXG4gICAgLnRoZW4oZnVuY3Rpb24gc3VjY2VzcyAocmVzcG9uc2UpIHtcblxuICAgICAgdGhpcy5yZXZpZXdzID0gcmVzcG9uc2UuZGF0YTtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuUmV2aWV3c0NvbnRyb2xsZXIucHJvdG90eXBlLnN1Ym1pdE5ld1JldmlldyA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5uZXdSZXZpZXcudGl0bGUgJiYgdGhpcy5uZXdSZXZpZXcuYm9keSkge1xuICAgIHRoaXMuX3Jldmlld3NTZXJ2aWNlXG4gICAgICAuc3VibWl0TmV3UmV2aWV3KHRoaXMubmV3UmV2aWV3KVxuICAgICAgLnRoZW4oZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICB0aGlzLnJldmlld3MucHVzaChyZXNwb25zZS5kYXRhKTtcbiAgICAgIH0uYmluZCh0aGlzKSwgZnVuY3Rpb24gZXJyb3IocmVzcG9uc2UpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIHN1Ym1pdHRpbmcgbmV3IHJldmlldy4nKTtcbiAgICAgIH0pO1xuICB9XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUmV2aWV3c0NvbnRyb2xsZXI7XG4iLCJ2YXIgUmV2aWV3c1NlcnZpY2UgPSBmdW5jdGlvbigkaHR0cCkge1xuICB0aGlzLl8kaHR0cCA9ICRodHRwO1xufTtcblxuUmV2aWV3c1NlcnZpY2UucHJvdG90eXBlLmdldFJldmlld3MgPSBmdW5jdGlvbihyZXN0YXVyYW50SWQpIHtcbiAgcmV0dXJuIHRoaXMuXyRodHRwLmdldCgnL2FwaS9yZXZpZXdzLz9yZXN0YXVyYW50PScgKyByZXN0YXVyYW50SWQpO1xufTtcblxuUmV2aWV3c1NlcnZpY2UucHJvdG90eXBlLnN1Ym1pdE5ld1JldmlldyA9IGZ1bmN0aW9uKG5ld1Jldmlldykge1xuICB2YXIgdXJsID0gJy9hcGkvcmV2aWV3cy9uZXcvP3Jlc3RhdXJhbnQ9JyArIG5ld1Jldmlldy5yZXN0YXVyYW50SWQgKyAnLyc7XG4gIFxuICByZXR1cm4gdGhpcy5fJGh0dHAoe1xuICAgIG1ldGhvZCAgOiAnUE9TVCcsXG4gICAgdXJsICAgICA6IHVybCxcbiAgICBkYXRhICAgIDogbmV3UmV2aWV3XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZXZpZXdzU2VydmljZTtcbiIsInZhciBSZXZpZXdzQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vcmV2aWV3cy1jb250cm9sbGVyLmpzJyk7XG52YXIgUmV2aWV3c1NlcnZpY2UgPSByZXF1aXJlKCcuL3Jldmlld3Mtc2VydmljZS5qcycpO1xudmFyIFJldmlldyA9IHJlcXVpcmUoJy4vcmV2aWV3LmpzJyk7XG5cbmFuZ3VsYXIubW9kdWxlKCdyZXZpZXdzJywgW10pXG4gICAgICAgIC5zZXJ2aWNlKCdyZXZpZXdzU2VydmljZScsIFJldmlld3NTZXJ2aWNlKVxuICAgICAgICAuY29udHJvbGxlcigncmV2aWV3c0NvbnRyb2xsZXInLCBSZXZpZXdzQ29udHJvbGxlcilcbiAgICAgICAgLmRpcmVjdGl2ZSgncmV2aWV3JywgUmV2aWV3KTtcbiJdfQ==
