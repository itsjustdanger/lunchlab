var ReviewsController = require('./reviews-controller.js');
var ReviewsService = require('./reviews-service.js');

angular.module('reviews', [])
        .service('reviewsService', ReviewsService)
        .controller('reviewsController', ReviewsController);
