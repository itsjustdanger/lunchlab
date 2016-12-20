var CommentsController = require('./comments-controller.js');
var CommentsService = require('./comments-service.js');
var Comment = require('./comment.js');

angular.module('comments', [])
        .service('commentsService', CommentsService)
        .controller('commentsController', CommentsController)
        .directive('comment', Comment);
