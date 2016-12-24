# LunchLab

*LunchLab* is a web app that helps hungry users find great spots to lunch.

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
To deploy the app, it's recommended you create a virtual environment and use pip to load the requirements found in the requirements.txt file. Once you do that, you'll need to set three primary environment variables [S3_KEY, S3_SECRET, and S3_BUCKET] to handle media file uploads and downloads with S3.

You should then use `npm install` to load all the front end requirements and run the standard gulp action to process js/scss/assets to the `lunchlab/static` folder. Then, you'll likely want to run `python manage.py collectstatic` so django will load all your static files for you.

From there you should be able to run a local server or configure the app for deployment.

## To Do
- Restaurant Show pages
  - Add additional details/content to restaurant show pages
