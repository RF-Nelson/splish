# [Splish](https://splishthat.herokuapp.com)
Splish is an event management platform that allows people to create events and manage a guest list.

This repo includes a Rails/Angular web app as well as a native iOS app. The Rails API uses [Pusher](https://pusher.com/?v=y) to allow for real-time communication of data between the API and any connected browser or iOS device. If you create a new event or change an RSVP, anyone looking on the web or their iPhone will be notified instantly.

##Web app

###Front-end
This web app was built on Rails 4 and Angular 1.4. You can build and run this app locally or [visit it live on Heroku](https://splishthat.herokuapp.com). Some of the more useful libraries used in the webapp are [Pusher](https://pusher.com/?v=y), [d3-ease](https://github.com/d3/d3-ease), [letters.js](http://letteringjs.com/), [mo.js](http://mojs.io/), and [Angular Material](https://github.com/angular/material), among others.

Currently, users can create and edit events, as well as RSVP to and de-RSVP from them.

At the moment I have far too many nested `ng-hide`'s and `ng-show`'s which has resulted in the Angular side not always displaying data correctly to the user.

The JS side still needs some work, but there is a heavy amount of styling in place. All of the code was written in one controller, and I plan on refactoring this in the future using the [`controller as` and vm design pattern](http://www.johnpapa.net/angularjss-controller-as-and-the-vm-variable/). Right now it's quite a task to find a relevant block of code.

Like the JS, the CSS could benefit from some re-factoring and organization, but you should be able to navigate the files based on their names.

Placeholder images are randomly assigned according to the `id` of each event, and are courtesy of [Unsplash It](https://unsplash.it). In the future, I plan to add the [Paperclip](https://github.com/thoughtbot/paperclip) gem to the Rails bundle, add a migration to add a column for `image_url` to the Events table, and set up an Amazon S3 bucket to store event images, which would be uploaded as part of the event creation form.

There are no CSS breakpoints at the moment; as such, the site is mostly unusable on mobile. I plan on adding a simple list view for mobile devices below the 768px breakpoint, which would also be available as a "Simple View" option on desktop clients.

###Back-end
The auth was written with help from the [bcrypt](https://github.com/codahale/bcrypt-ruby) gem, which handles encryption and pashword hashing. The database used is PostgreSQL, and there are only two models, Guests and Events. Currently, they associate through a `has_and_belongs_to_many` join table association, but in the future I plan on performing a migration and creating an RSVP table, which will serve as a junction for a `has_many :through` association.

###Local setup
Clone this repo and go into the splish-webapp directory. Make sure you have ruby installed and run `bundle install` to setup all of the luscious gems.

Install PostgreSQL if you don't already have it, and then run `rake db:create db:migrate db:seed`.

Seeds are generated from the `db/seeds.rb` file. I utilized the [faker](https://github.com/stympy/faker) gem to generate [Hipster Ipsum](http://hipsum.co/)-based data seeds. Seeding creates 50 guests, 50 events, and 300 RSVPs between the guests and events.

If you're having a good day, then all you'll have to do after that is type `rails s` to start the Rails server, and point your local browser to `localhost:3000`, the default local Rails server address, and try your best to not weep at the beauty.

The beginnings of a testing framework are in place with the help of [RSpec](https://github.com/rspec/rspec) and [Capybara](https://github.com/jnicklas/capybara). Currently only unit tests for the Guest and Event models are fully in place, and the beginnings of user auth and event creation integration tests have been created, but need to be updated and expanded.

##iOS App
The iOS app right now serves as an event viewer, since I have not yet integrated the Rails auth into it yet. The app is written in Swift and utilizes the [AlamoFire](https://github.com/Alamofire/Alamofire) CocoaPod to make asynchronous GET requests from the Rails API, the parsing of which is handled mostly by [SwiftyJSON](https://github.com/SwiftyJSON/SwiftyJSON). 

There is only a single ViewController; it pings the Rails API, parses the JSON, and outputs the data into a TableView. If any subsequent events are created, the Pusher service will notify the iOS user immedately and add the cell to the tableView.

### Local setup
Anyone with a Mac that can run Xcode 7.3 can build the app and share in the joy of instant event notification on their iOS device or in the iOS simulator.
The newest release of AlamoFire requires Xcode 7.3, although you can probably install an old version of the CocoaPod and it would work fine. 

