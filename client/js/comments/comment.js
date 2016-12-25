var Comment = function() {
  return {
    templateUrl: '/staticfiles/templates/comments/comment.html',
    restrict: 'E',
    scope: {
      comment: '=data'
    },
  };
};

module.exports = Comment;
