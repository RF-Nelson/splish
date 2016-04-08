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

###Back-end
The auth was written from scratch, which, when it comes to Rails, sounds far more impressive than it actually is. The password hashing is handled by the [bcrypt](https://github.com/codahale/bcrypt-ruby) gem.
The database used is PostgreSQL, and there are only two models, Guests and Events. Currently, they associate through a `has_and_belongs_to_many` join table association, but in the future I plan on performing a migration and creating an RSVP table, which will serve as a junction for a `has_many :through` association.

###Local setup
Clone this repo and go into the splish-webapp directory. Make sure you have ruby installed and run `bundle install` to setup all of the luscious gems.

Install PostgreSQL if you don't already have it, and then run `rake db:create db:migrate db:seed`.

If you're having a good day, then all you'll have to do after that is type `rails s` to start the Rails server, and point your local browser to `localhost:3000`, the default local Rails server address, and try your best to not weep at the beauty.

##iOS App
The iOS app right now serves as an event viewer, since I have not yet integrated the Rails auth into it yet. The app is written in Swift and utilizes the [AlamoFire](https://github.com/Alamofire/Alamofire) CocoaPod to make asynchronous GET requests from the Rails API, the parsing of which is handled mostly by [SwiftyJSON](https://github.com/SwiftyJSON/SwiftyJSON). 

There is only a single ViewController; it pings the Rails API, parses the JSON, and outputs the data into a TableView. If any subsequent events are created, the Pusher service will notify the iOS user immedately and add the cell to the tableView.

### Local setup
Anyone with a Mac that can run Xcode 7.3 can build the app and share in the joy of instant event notification on their iOS device or in the iOS simulator.
The newest release of AlamoFire requires Xcode 7.3, although you can probably install an old version of the CocoaPod and it would work fine. 

