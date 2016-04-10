<div align="center"><a href="https://splishthat.herokuapp.com/"><img src="http://i.imgur.com/EiCOD6u.png"/><br>click to see live demo</a> <br><br></div>
Splish is an event management platform that allows people to create events and manage a guest list. You can see a live demo at: https://splishthat.herokuapp.com

This repo includes a Rails/Angular web app as well as a native iOS app. The Rails API uses [Pusher](https://pusher.com/?v=y) to allow for real-time communication of data between the API and any connected browser or iOS device. If you create a new event or change an RSVP, anyone looking on the web or their iPhone will be notified instantly.

##Web app

###Front-end
This front-end of this web app is built on Angular 1.4. You can build and run this app locally or [visit it live on Heroku](https://splishthat.herokuapp.com). Some of the more useful libraries used in the webapp are [Pusher](https://pusher.com/?v=y), [d3-ease](https://github.com/d3/d3-ease), [letters.js](http://letteringjs.com/), [mo.js](http://mojs.io/), and [Angular Material](https://github.com/angular/material), among others.

Currently, users can create and edit events, as well as RSVP to and de-RSVP from them.

The JS side is in need of refactoring. All of the code was written in one controller and one service which manages the collection of events. I plan on refactoring this in the future using the [`controller as` and vm design pattern](http://www.johnpapa.net/angularjss-controller-as-and-the-vm-variable/). Right now it's quite a task to find a relevant block of code in that file. Like the JS, the CSS could also benefit from some re-factoring and organization.

Placeholder images are randomly assigned according to the `id` of each event, and are courtesy of [Unsplash It](https://unsplash.it). In the future, I plan to add the [Paperclip](https://github.com/thoughtbot/paperclip) gem to the Rails bundle, add a migration to add a column for `image_url` to the Events table, and set up an Amazon S3 bucket to store event images, which would be uploaded as part of the event creation form.

###Back-end
The back-end is written in Rails, which serves JSON over an API. The auth was written with help from the [bcrypt](https://github.com/codahale/bcrypt-ruby) gem, which handles encryption and pashword hashing. The database used is PostgreSQL, and there are only two models, Guests and Events. Currently, they associate through a `has_and_belongs_to_many` join table association, but in the future I plan on performing a migration and creating an RSVP table, which will serve as a junction for a `has_many :through` association.

###Local setup
Clone this repo and go into the splish-webapp directory. Make sure you have ruby installed and run `bundle install` to setup all of the luscious gems.

Install PostgreSQL if you don't already have it, and then run `rake db:create db:migrate db:seed`.

Seeds are generated from the `db/seeds.rb` file. I utilized the [faker](https://github.com/stympy/faker) gem to generate [Hipster Ipsum](http://hipsum.co/)-based data seeds. Seeding creates 50 guests, 50 events, and 300 RSVPs between the guests and events.

If you're having a good day, then all you'll have to do after that is type `rails s` to start the Rails server, and point your local browser to `localhost:3000`, the default local Rails server address, and try your best to not weep at the beauty.

The beginnings of a testing framework are in place with the help of [RSpec](https://github.com/rspec/rspec) and [Capybara](https://github.com/jnicklas/capybara). Currently only unit tests for the Guest and Event models are fully in place, and the beginnings of user auth and event creation integration tests have been created, but need to be updated and expanded.

##iOS App
The iOS app right now serves as an event viewer, as the Rails auth is not yet integrated. The app is written in Swift and utilizes the [AlamoFire](https://github.com/Alamofire/Alamofire) CocoaPod to make asynchronous GET requests from the Rails API as well as Pusher to allow for real-time notification of newly-created events. 

There is only a single ViewController; it pings the Rails API, parses the JSON with the help of [SwiftyJSON](https://github.com/SwiftyJSON/SwiftyJSON), and outputs the data into a TableView. If any subsequent events are created, the Pusher service will notify the iOS user immedately and add the cell to the tableView.

### Local setup
Anyone with a Mac that can run Xcode 7.3 can build the app and share in the joy of instant event notification on their iOS device or in the iOS simulator.
The newest release of AlamoFire requires Xcode 7.3, although you can probably install an old version of the CocoaPod and it would work fine. 

### Notes and To-Do

This repo includes the app API key for pusher, so unless you configure your own Pusher account, all newly created events will be pushed to _all_ connected clients, regardless of whether you are running locally or not. The Pusher system doesn't know the difference and any events created in any environment will be transmitted to all other connected clients.

Although there is no mobile-specific breakpoint, the CSS 3D effects work rather well on modern mobile devices.

- [ ] Refactor Angular `app.js` file into separate controllers
- [ ] Add a 'simple' list view option
- [ ] Improve cross-browser compatbility (currently optimized for Chrome; spacing issues on Firefox/Mobile Safari)
- [ ] Expand intergration testing
- [ ] Add the [Paperclip](https://github.com/thoughtbot/paperclip) gem and allow uploaded images
- [ ] Add the [pg_search](https://github.com/Casecommons/pg_search) gem to allow user to search for title, description, etc.
- [ ] Add 'keywords' to allow filtering and searching of like-minded events
- [ ] Create a "Comments" table and allow users to add comments to event
