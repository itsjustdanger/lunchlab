# LunchLab

*LunchLab* is a web app that helps hungry users find great spots to lunch.

### Required Features:
  - Keeps track of users' visited restaurants
  - Users can read reviews for a restaurant
  - Users can write reviews for visited restaurants
  - Other users can comment on reviews
  - Can 'thumbs-down' a restaurant to remove it from consideration
  - Admins can add restaurants
  - When adding a restaurant, find the lat/lng based on the address
  - Handle incorrect address entry
  - User profiles have profile pictures, and can be edited
  - Users have a dashboard/feed with lunch options

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
  - Users have profile pages with profile pictures and editable details



## To Do
- Refactor restaurant JSON conversion: right now we're doing it in a few places. Create a to_json method either on the model or somewhere reasonable.
- Add user information directly to review model.
