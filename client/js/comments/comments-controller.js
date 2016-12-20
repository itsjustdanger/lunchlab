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

CommentsController.prototype.submitNewComment = function(reviewId) {
  if (this.newComment.body) {
    newComment.reviewId = reviewId;
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
