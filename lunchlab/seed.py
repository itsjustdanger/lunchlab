from django.core.files import File
from django.contrib.auth.models import User
from users.models import User
from restaurants.models import Restaurant
from reviews.models import Review
from comments.models import Comment
from urllib.request import urlopen
import os
import random

NUM_USERS = 50
NUM_REVIEWS = 100
NUM_COMMENTS = 400

avatar_base_url = 'https://s3.amazonaws.com/lunchlab/avatars/'
rest_base_url = 'https://s3.amazonaws.com/lunchlab/restaurant-images/'

username_prefixes = ['super', 'evil', 'mega', 'ultra', 'diner', 'preemptive', 'django', 'mondo', 'hero', 'villain', 'sidekick', 'pastafiend', 'adventurous', 'special', 'shy', 'friendly', 'sly', 'sneaky', 'outrageous', 'careful', 'callous', 'mysterious', 'magical', 'able', 'active', 'astute', 'ample', 'brave', 'creepy', 'daring', 'fake', 'famous', 'flammable', 'great', 'gross', 'grand', 'hero', 'imaginary', 'joker', 'jester', 'jarring', 'king', 'knowing', 'lamenting', 'loser', 'neighbor', 'ocean', 'oedipus', 'ophelia', 'prince', 'princess', 'hamlet', 'lear']

username_suffixes = ['mike', 'man', 'woman', 'girl', 'guy', 'boy', 'gal', 'diner', 'dan', 'sarah', 'jess', 'frank', 'joe', 'kate', 'emily', 'taylor', 'charlie', 'bryan', 'john', 'julia', 'ken']

first_names = ['dan', 'kate', 'julia', 'zane', 'bryan', 'john', 'yulhee', 'andrew', 'laura', 'sarah', 'phil', 'chris', 'sara', 'michelle', 'derek', 'destin', 'kamille', 'james', 'joanna', 'rocky']

last_names = ['smith', 'johnson', 'mcgruber', 'balboa', 'schumacher', 'ramsay', 'bourdain', 'colicchio', 'meyers', 'robinson', 'grey', 'red', 'jacobson', 'mjolnir', 'siggardson', 'ofoz']

review_titles = ['This place is great', 'So-so food for too much $$$', 'Small portions, big taste', 'Not that great', 'Better than expected', 'Way overrated', 'Believe the hype!', 'Unreasonably good!', 'You won\'t regret shelling out the cash for this food!', 'Favorite lunch spot in the area!', 'Glad we went here', 'Never coming back', 'Not too bad, not very good', 'I will be here EVERY DAY', 'Eat here. Now. Trust me.', 'Avoid this place at all costs!', 'Distaster.', 'Great food, terrible service.']

lorem = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

restaurants = [{"name": "Artichoke Basille's Pizza", "lng": "-74.00660", "address": "114 10th Ave, New York, NY 10011, United States", "lat": "40.74408"}, {"name": "Domino's Pizza", "lng": "-73.99746", "address": "16 W 8th St, New York, NY 10011, United States", "lat": "40.73258"}, {"name": "Mission Chinese Food", "lng": "-73.98950", "address": "171 E Broadway, New York, NY 10002, United States", "lat": "40.71393"}, {"name": "Papa John's Pizza", "lng": "-73.98298", "address": "chinese", "lat": "40.73035"}, {"name": "Blue Bottle Coffee", "lng": "-74.00707", "address": "450 W 15th St, New York, NY 10014, United States", "lat": "40.74243"}, {"name": "Crazy Place on 6th", "lng": "-73.99280", "address": "6th Ave, New York, NY, USA", "lat": "40.74290"}, {"name": "Village Taverna", "lng": "-73.99308", "address": "81 University Pl, New York, NY 10003, United States", "lat": "40.73331"}, {"name": "Thai Terminal", "lng": "-73.98388", "address": "349 E 12th St, New York, NY 10003, USA", "lat": "40.73026"}, {"name": "Toloache", "lng": "-73.98557", "address": "251 W 50th St, New York, NY 10019, United States", "lat": "40.76231"}, {"name": "Indikitch", "lng": "-73.99047", "address": "25 W 23rd St, New York, NY 10010, United States", "lat": "40.74218"}, {"name": "Patsy's", "lng": "-73.98274", "address": "236 W 56th St, New York, NY 10019, United States", "lat": "40.76564"}, {"name": "French Louie", "lng": "-73.98819", "address": "320 Atlantic Ave, Brooklyn, NY 11201, USA", "lat": "40.68802"}, {"name": "Casa Mono", "lng": "-73.98716", "address": "52 Irving Pl, New York, NY 10003, United States", "lat": "40.73593"}, {"name": "Barraca", "lng": "-74.00157", "address": "81 Greenwich Ave, New York, NY 10014, United States", "lat": "40.73705"}, {"name": "New York Burger Co.", "lng": "-74.00410", "address": "470 W 23rd St # 1, New York, NY 10011, United States", "lat": "40.74749"}, {"name": "Blue Collar", "lng": "-73.95787", "address": "160 Havemeyer St, Brooklyn, NY 11211, United States", "lat": "40.71149"}, {"name": "Grand Central Oyster Bar & Restaurant", "lng": "-73.97738", "address": "89 E 42nd St, New York, NY 10017, United States", "lat": "40.75247"}, {"name": "Pedro's", "lng": "-73.98647", "address": "73 Jay St, Brooklyn, NY 11201, United States", "lat": "40.70252"}, {"name": "Eleven Madison Park", "lng": "-73.98717", "address": "Metropolitan Life North Building, 11 Madison Ave, New York, NY 10010, United States", "lat": "40.74173"}]

comments = ['I guess I\'m going here tomorrow!', 'Sounds perfect.', 'Phew, glad I skipped this place.', 'Totally of base, this place is great.', 'What were you thinking?', 'WOW, someone is a snob.', 'Mods are def editing our comments.', 'Meh, I thought it was mediocre.', 'Jeez, you are a terrible writer', 'I can hardly understand this review', 'Possibly one of the worst things I have read.', 'Nice job!', 'Wow, this sounds great!', 'Are they paying you to write this?', 'Are you sure you weren\'nt drunk?', 'I think you wrote a review for the wrong place.', 'Are you kidding me? This place is garbage!', 'Hi, I\'m a troll.']

def create_username():
    prefix = random.sample(username_prefixes, 1)[0]
    suffix = random.sample(username_suffixes, 1)[0]
    number = str(random.randint(1, 99))
    return (prefix + suffix + number)

def create_user():
    username = create_username()
    email = username + '@lunchlab.io'

    user = User.objects.create_user(username=username,
        password='password', first_name=random.sample(first_names, 1)[0],
        last_name=random.sample(last_names, 1)[0],
        email=email)

    avatar_url = ''.join([avatar_base_url, 'profile', str(random.randint(1,7)),'.png'])

    response = urlopen(avatar_url)

    with open('tmp_img', 'wb') as f:
        f.write(response.read())

    with open('tmp_img', 'rb') as f:
        image_file = File(f)
        file_name = ''.join(['avatar-', str(random.randint(0, 10000)), '.png'])
        user.lunchprofile.avatar.save(file_name, image_file)
    os.remove('tmp_img')

    user.save()

def create_restaurants():
    for rest in restaurants:
        restaurant = Restaurant.objects.create(name=rest['name'],
                address=rest['address'], description=lorem,
                lat=rest['lat'], lng=rest['lng'])

        image_url = ''.join([rest_base_url, 'food', str(random.randint(1, 16)), '.jpg'])

        response = urlopen(image_url)

        with open('tmp_img', 'wb') as f:
            f.write(response.read())

        with open('tmp_img', 'rb') as f:
            image_file = File(f)
            file_name = ''.join(['restaurant-', str(random.randint(0, 10000)), '.jpg'])
            restaurant.image.save(file_name, image_file)
        os.remove('tmp_img')
        restaurant.save()

def create_review(users, restaurants):
    review_title = random.sample(review_titles, 1)[0]
    user = random.sample(users, 1)[0]
    restaurant = random.sample(restaurants, 1)[0]
    user.lunchprofile.visits.add(restaurant)
    user_name = ''.join([user.first_name, ' ', user.last_name])
    user_avatar_url = user.lunchprofile.avatar.url if user.lunchprofile.avatar else None
    review = Review.objects.create( title=review_title, body=lorem,
                                    user=user, restaurant=restaurant, user_name=user_name,
                                    user_avatar_url=user_avatar_url)
    review.save()
    user.save()

def create_comment(users, reviews):
    user = random.sample(users, 1)[0]
    review = random.sample(reviews, 1)[0]
    body = random.sample(comments, 1)[0]
    comment = Comment.objects.create(body=body, user=user, review=review)

    comment.save()

def seed_database():
    print ('-x-Seeding Database-x-')
    create_restaurants()
    print ('-x-Seeding Restaurants-x-')

    for i in range(NUM_USERS):
        create_user()
    print ('-x-Seeding Users-x-')

    users = list(User.objects.all())
    restaurants = list(Restaurant.objects.all())

    for i in range(NUM_REVIEWS):
        create_review(users, restaurants)
    print ('-x-Seeding Reviews-x-')

    reviews = list(Review.objects.all())

    for i in range(NUM_COMMENTS):
        create_comment(users, reviews)
    print ('-x-Seeding Comments-x-')
    print ('-x-Finished Seeding Database-x-')

def clear_database():
    Restaurant.objects.all().delete()
    print ('-x-Deleted Restaurants-x-')
    User.objects.all().delete()
    print ('-x-Deleted Users-x-')
    Review.objects.all().delete()
    print ('-x-Deleted Reviews-x-')
    Comment.objects.all().delete()
    print ('-x-Deleted Comments-x-')
    print ('-x-All Entries Deleted-x-')

def reset_and_seed():
    clear_database()
    seed_database()
