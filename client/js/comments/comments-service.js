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
