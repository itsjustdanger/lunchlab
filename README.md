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

Development of *LunchLab* is going to be split into self-contained phases.

## Phase 1
#### Restaurants and Users
  - ~~Users can view list of restaurants~~
  - ~~Users can view an individual restaurant's page~~

## Phase 2
#### Visiting
  - ~~Users can 'visit' restaurants~~
  - ~~Users can see all of their visited restaurants~~

#### Reviews
  - ~~Users can review 'visited' restaurants~~
  - ~~Users can comment on other users' reviews~~


## Phase 3
#### Admins and New Restaurants
  - ~~Only Admins can create restaurants~~
  - ~~When adding restaurants, restaurant name is auto-completed~~
  - ~~When adding restaurants, lat/lng is returned~~
  - ~~When adding restaurants, handle incorrect addresses~~


## Phase 4
#### User Feed
  - ~~Users' home pages are feeds of restaurants options (visited/unvisted)~~
  - ~~Users can 'thumbs-down' a restaurant option to permanently remove it from the feed~~
#### User Profile
  - ~~Users have profile pages with profile pictures and editable details~~



## To Do
- Restaurant Creation Page
  - Map inits with current user location
  - No results selections? Only auto complete?
- Restaurant Images
  - Add attachable images to restaurants
  - Pre-populate images based on google maps image api (if possible)
  - Users can submit images to restaurants?
- Restaurant Show pages
  - Add additional details/content to restaurant show pages
  - Add map display with marker to restaurant show pages.
- Restaurant Reviews/Comments
  - Style reviews with author information
  - Style comments with author information and better load button
- Add user information directly to review model.
