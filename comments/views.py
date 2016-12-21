import json

from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, HttpResponseBadRequest, HttpResponseForbidden
from reviews.models import Review
from comments.models import Comment

def index(request):
    user = request.user if request.user.is_authenticated() else None
    review_id = request.GET.get('review', '')
    comments = []

    for c in Comment.objects.filter(review_id=review_id):
        comments.append({
            'userName': c.user_name,
            'userId': c.user_id,
            'reviewId': c.review_id,
            'body': c.body
        })

    return JsonResponse(comments, safe=False)

def new(request):
    if not request.user.is_authenticated():
        return HttpResponseForbidden

    user = request.user

    data = json.loads(request.body.decode('utf-8'))
    review = get_object_or_404(Review, id=data['reviewId'])
    comment = Comment(  body=data['body'], user=user, review=review,
                        user_name=("%s %s" % (user.first_name, user.last_name)))

    try:
        comment.save()
    except:
        return HttpResponseBadRequest()

    return JsonResponse({   'userName': comment.user_name,
                            'userId': comment.user_id,
                            'reviewId': comment.review_id,
                            'body': comment.body }, safe=False)

def delete(request, id):
    comment = get_object_or_404(Comment, id=id)
    if not request.user.is_authenticated() \
    or comment.user_id != request.user.id:
        return HttpResponseForbidden

    try:
        comment.delete()
    except:
        return HttpResponseBadRequest()
