from django.contrib.auth.models import User
from users.models import User
from restaurants.models import Restaurant
from reviews.models import Review
from comments.models import Comment

NUM_USERS = 50
users = []

username_prefix = ['super', 'evil', 'mega', 'ultra', 'diner', 'preemptive', 'django', 'mondo', 'hero', 'villain', 'sidekick', 'pastafiend', 'adventurous', 'special', 'shy', 'friendly', 'sly', 'sneaky', 'outrageous', 'careful']

username_suffix = ['mike', 'man', 'woman', 'girl', 'guy', 'boy', 'gal', 'diner', 'dan', 'sarah', 'jess', 'frank', 'joe', 'kate', 'emily', 'taylor', 'charlie', 'bryan', 'john', 'julia', 'ken']

first_name = ['dan', 'kate', 'julia', 'zane', 'bryan', 'john', 'yulhee', 'andrew', 'laura', 'sarah', 'phil', 'chris', 'sara', 'michelle', 'derek', 'destin', 'kamille', 'james', 'joanna', 'rocky']

last_name = ['smith', 'johnson', 'mcgruber', 'balboa', 'schumacher', 'ramsay', 'bourdain', 'colicchio', 'meyers', 'robinson', 'grey', 'red', 'jacobson', 'mjolnir', 'siggardson', 'ofoz']

def create_username():
    prefix = random.sample(username_prefix, 1)
    suffix = random.sample(username_suffix, 1)

    return (prefix + suffix)

def create_user():
    username = create_username()
    email = username + '@lunchlab.io'
    user = User.objects.create_user(username=username,
        password='password', first_name=random.sample(first_name, 1),
        last_name=random.sample(last_name, 1),
        email=email)
    user.save()

    users.append(user)

review_titles = ['This place is great', 'So-so food for too much $$$', 'Small portions, big taste', 'Not that great', 'Better than expected', 'Way overrated', 'Believe the hype!', 'Unreasonably good!', 'You won\'t regret shelling out the cash for this food!', 'Favorite lunch spot in the area!', 'Glad we went here', 'Never coming back', 'Not too bad, not very good', 'I will be here EVERY DAY', 'Eat here. Now. Trust me.', 'Avoid this place at all costs!', 'Distaster.', 'Great food, terrible service.']

lorem = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
