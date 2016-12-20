var ReviewsController = require('./reviews-controller.js');
var ReviewsService = require('./reviews-service.js');
var Review = require('./review.js');

angular.module('reviews', [])
        .service('reviewsService', ReviewsService)
        .controller('reviewsController', ReviewsController)
        .directive('review', Review);
