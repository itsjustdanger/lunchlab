# LunchLab

*LunchLab* is a web app that helps hungry users find great spots to lunch.

## Core Features:
  - Users can sign in/up
  - Signed in users can 'thumbs-down' restaurants to remove them from the restaurant list.
  - Signed in users can mark restaurants as 'visited' to remove them from the 'unvisited' list and add them to the 'visited' list.
  - Users can review 'visited' restaurants
  - Users can comment on reviews
  - Users can add/edit basic profile information
  - Users can upload/edit avatars (Stored on AWS S3)

  To demonstrate some management capabilities, when creating a user account, you can specify 'is admin'. This will give you basic admin privileges and allow you edit and create new restaurants in the db.

  - Admins can create/edit restaurants
  - Restaurant creation integrates with the Google Maps API and Google Places library to autocomplete addresses.
  - Admins can add/edit restaurant images (Stored on AWS S3)


## To Do
  I'm looking to add a number of features to the app for both experimentation and to fill in a number gaps in the current implementation.

  - Improve front-end/back-end model validations
  - Handle/Display form errors on restaurant/user/review/comment creation
  - Implement robust integration, e2e, and unit tests for 90%+ test coverage
  - Style Restaurants admin index
  - Improve styles site-wide
  - Replace long homepage restaurant list with carousels
  - Add categories and other details to restaurant model
  - Use 'visited', 'thumb-down', and categories to implement a 'recommendation-engine'
  - Replace admin created restaurants with auto-generated restaurants using Google Maps API
  - Implement restaurant search by category
  - Add SSL cert

### Required Features:
  - [x] Keeps track of users' visited restaurants
  - [x] Users can read reviews for a restaurant
  - [x] Users can write reviews for visited restaurants
  - [x] Other users can comment on reviews
  - [x] Can 'thumbs-down' a restaurant to remove it from consideration
  - [x] Admins can add restaurants
  - [x] When adding a restaurant, find the lat/lng based on the address
  - [x] Handle incorrect address entry
  - [x] User profiles have profile pictures, and can be edited
  - [x] Users have a dashboard/feed with lunch options

## Deployment
To deploy the app, it's recommended you create a virtual environment and use pip to load the requirements found in the requirements.txt file. Once you do that, you'll need to set three primary environment variables [S3_KEY, S3_SECRET, and S3_BUCKET] to handle media file uploads and downloads with S3. And don't forget to add a Django SECRET_KEY to the environment as well!

You should then use `npm install` to load all the front end requirements and run the standard gulp action to process js/scss/assets to the `lunchlab/static` folder. Then, you'll likely want to run `python manage.py collectstatic` so django will load all your static files for you.

From there you should be able to run a local server or configure the app for deployment.
