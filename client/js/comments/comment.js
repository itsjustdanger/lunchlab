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
