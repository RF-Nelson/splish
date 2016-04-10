var app = angular.module('splish',['ngMaterial', 'pusher-angular', 'ng-rails-csrf', 'ngMaterialDatePicker']);

app.factory('eventService', ['$http', function($http) {
  // A SERVICE TO MANAGE THE COLLECTION OF EVENTS
  var eventService = {};
  eventService.events = []

  eventService.getEvents = function () {
    return $http.get('/api/events/').then(function (response) {
      eventService.events = angular.fromJson(response.data);
      return eventService.events;
    })
  }

  // TAKES IN EVENT DATA, IF THE MATCHING ID IS FOUND, THE EVENT DATA IS UPDATED.
  // IF NO MATCHING DATA IS FOUND, A NEW EVENT IS ADDED TO THE events COLLECTION
  eventService.updateEvent = function (data) {
    var eventAlreadyExists = false;
    for (var i = 0; i < eventService.events.length; i++) {
      if (eventService.events[i].id === data.id) {
        eventService.events[i] = data;
        eventAlreadyExists = true
        break;
      }
    }

    if (!eventAlreadyExists) {
      eventService.events.push(data)
    }

    return eventService.events;
  }

  return eventService;
}]);

app.controller('EventController', ['$scope', '$http', '$pusher', '$mdDialog', '$q', '$timeout', '$rootScope', 'eventService', '$mdToast', function($scope, $http, $pusher, $mdDialog, $q, $timeout, $rootScope, eventService, $mdToast) {

  eventService.getEvents().then(function(events) {
    $scope.events = events;
  })

  $rootScope.$watch(
    function () {
      return eventService.events;
    },
    function (newValue, oldValue) {
      $scope.events = newValue;
    },
    true
  )

  // GET USER ID STORED IN DATA ATTRIBUTE BY RAILS
  var dataDiv = document.getElementById('div-item-data');
  if (dataDiv) {
    $scope.user_id = dataDiv.getAttribute('data-user-id');
  }

  // CONFIGURE PUSHER TO ENABLE REAL-TIME DATA UPDATES
  var client = new Pusher('28994c89518c14262f75');
  var pusher = $pusher(client);
  var newEvents = pusher.subscribe('test_channel');
  newEvents.bind('my_event',
  function (data) {
    eventService.updateEvent(data.message);

    if (data.message.owner_id != $scope.user_id) {
      $scope.showNewEventToast(data.message.id)
    }
  })

  newEvents.bind('eventUpdates',
  function (data) {
    $scope.events = eventService.updateEvent(data.message)
  })

  // SHOW THE USER AN ALERT WHEN A NEW EVENT IS CREATED (ONLY IF ANOTHER USER CREATED THE EVENT)
  $scope.showNewEventToast = function(id) {
    if (id === $scope.user_id) {
      return;
    } else {
      var toast = $mdToast.simple()
            .hideDelay(5500)
            .position('center center')
            .action("A New Event Has Been Created!")
      $mdToast.show(toast)
    }
  };

  $scope.message = {};

  $scope.submitForm = function () {
    var message = "Your event is missing "
    window.validEntry = false;
    if (!$scope.message.location) {
      $scope.showActionToast(message + "a location.")
      return
    } else if (!$scope.message.description) {
      $scope.showActionToast(message + "a description.")
      return
    } else if (!$scope.message.title) {
      $scope.showActionToast(message + "a title.")
      return
    } else if (new Date($scope.message.start_date).getDate() > new Date($scope.message.end_date).getDate()) {
      $scope.showActionToast("Please make sure the end date comes after the start date of your event.")
      return
    } else if (new Date() > new Date($scope.message.start_date)) {
      $scope.showActionToast("Unless you're Marty McFly, that start date is not possible.")
      return
    }
    window.validEntry = true;
    $scope.message.location = locationInput.value
    $scope.message.owner_id = $scope.user_id;
    $http({
      method  : 'POST',
      url     : './api/events/',
      data    : { data: $scope.message },
      headers : {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function (data) {
      if (data.status === 200) {
        $scope.message = {};

        //RESET INPUT FIELD
        var fields = document.getElementsByClassName("input--filled")
        Array.prototype.slice.call(fields).forEach(function (field) {
          $(field).removeClass("input--filled")
        })
      }
    })
  }

  $scope.submitEditForm = function () {
    id = $scope.editingEventID;
    if (locationInput.value) $scope.message.location = locationInput.value
    $http({
      method  : 'PUT',
      url     : './api/events/' + id,
      data    : { data: $scope.message },
      headers : {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function (data) {
      if (data.status === 200) {
        $http.get('/api/events/' + id).then(function (response) {
          $scope.events = eventService.updateEvent(response.data);
          $scope.message = {};
        })
      }
    })

    $scope.editingEventID = null;
  }

  $scope.rsvp = function ($event, eventID) {
    var data = {rsvp: $scope.user_id}
    $http({
      method  : 'PUT',
      url     : './api/events/' + eventID,
      data    : { data: data },
      headers : {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function (data) {
        if (data.status === 200) {
          $http.get('/api/events/' + eventID).then(function (response) {
            $scope.events = eventService.updateEvent(response.data);
          })
        }
      })
    }

  $scope.dersvp = function ($event, eventID) {
    var data = {dersvp: $scope.user_id}
    $http({
      method  : 'PUT',
      url     : './api/events/' + eventID,
      data    : { data: data },
      headers : {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function (data) {
        if (data.status === 200) {
          $http.get('/api/events/' + eventID).then(function (response) {
            $scope.events = eventService.updateEvent(response.data);
          })
        }
      })
    }

  $scope.checkIfRSVPd = function (event) {
  if (event) {
    for (var i = 0; i < event.length; i++) {
      if (event[i].id == $scope.user_id) {
        console.log('found rsvp event for event #: ' + event.id + '  and user #: ' + $scope.user_id);
        return true;
      }
    }
  }

    return false;
  }

  var submitForm = document.getElementById('modal-form');
  var locationInput = document.getElementById('autocomplete');
  setTimeout(function () {
    google.maps.event.addListener(locationInput, 'place_changed', function() {
      var place = autocompleteFrom.getPlace();
      $scope.message.location = place;
      $scope.$apply()
    });
  }, 1000)

  $scope.editingEventID;

  $scope.fillEditField = function(event) {
    window.openEditModal()
    $scope.editingEventID = event.id
    var values = [event.title, event.description, event.location, event.start_date, event.end_date]
    var fields = $('.edit-modal-form').children()
    for (var i = 0; i < fields.length - 1; i++) {
      if (values[i]) {
      var formField = angular.element($(fields[i]).children()[0]);
      if (i === 3 || i === 4) {
        var dateString = new Date(values[i]).toLocaleString()
        dateString = dateString.substring(0, dateString.length - 6) + dateString.substring(dateString.length - 3, dateString.length)
        formField.val(dateString)
      } else {
        formField.val(values[i])
      }

      $(formField).parent().addClass('input--filled')
      }
    }
  }

  $scope.showActionToast = function(text, isEditForm) {
    if (isEditForm) {
      var el = $('#angular-triggered-modal');
    } else {
      var el = $('.modal-header');
    }
    var toast = $mdToast.simple()
          .textContent(text)
          .hideDelay(3000)
          .parent(el[0])
          .position('top left')
    $mdToast.show(toast)
  };

  $scope.filter = 'all'

  $scope.setFilter = function (event) {
    if (event.start_date == null || event.end_date == null) {
      if ($scope.sortState === "Sort by Event Title") {
        return;
      }
    }

    switch ($scope.filter) {
      case 'upcoming':
        if (new Date() < new Date(event.start_date)) {
            return event;
        }
        return;
      case 'past':
        if (new Date() > new Date(event.end_date)) {
          return event;
        }
        return;
      case 'all':
          return event;
      case 'created':
        if ($scope.user_id == event.owner_id) {
          return event;
        }
        return;
      case 'tbd':
        return;
      case 'rsvpd':
        for (var i = 0; i < event.guests.length; i++) {
          if (event.guests[i].id == $scope.user_id) {
            return event;
          }
        }
      return;
    }
  }

  $scope.didAttendPastEvent = function (event) {
    return $scope.checkIfRSVPd(event.guests) && $scope.notTBDandPastEvent(event);
  }

  $scope.checkIfAttendingFutureEvent = function (event) {
    return $scope.checkIfRSVPd(event.guests) && !($scope.notTBDandPastEvent(event));
  }

  $scope.checkIfEligibleToCancelEvent = function (event) {
    return $scope.checkIfRSVPd(event.guests) && !($scope.notTBDandPastEvent(event));
  }

  $scope.isTBD = function (event) {
    if (event) {
      return !event.start_date || !event.end_date
    }
  }

  $scope.notTBDandPastEvent = function (event) {
    if (event) {
      return !$scope.isTBD(event) && new Date(event.end_date) < new Date();
    } else {
      return false;
    }
  }

  $scope.notTBDandFutureEvent = function (event) {
    if (event) {
      return !$scope.isTBD(event) && new Date(event.end_date) > new Date();
    } else {
      return false;
    }
  }

  $scope.setFilterTBD = function (event) {
    var TBDsection = true;
    switch ($scope.filter) {
      case 'upcoming':
        return
      case 'past':
        return
      case 'all':
        if (TBDsection) {
          if (!event.start_date || !event.end_date) {
            return event
          }
        }
      case 'created':
        if ($scope.user_id == event.owner_id) {
          if (TBDsection) {
            if (!event.start_date || !event.end_date) {
              return event
            }
          }
        }
        return;
      case 'tbd':
        if (!event.start_date || !event.end_date) {
          return event;
        }
      case 'rsvpd':
        for (var i = 0; i < event.guests.length; i++) {
          if (event.guests[i].id == $scope.user_id) {
            if (!event.start_date || !event.end_date) {
              return event
            }
          }
        }
      }
    }

    $scope.predicate = 'start_date'
    $scope.sortState = "Sort by Event Title"
    $scope.toggleSort = function (bool) {
      $('.close-button').click()
      if (bool) {
        if ($scope.sortState === "Sort by Event Title") {
          $scope.predicate = 'title'
          $scope.sortState = "Sort by Event Date"
        } else {
          $scope.predicate = 'start_date'
          $scope.sortState = "Sort by Event Title"
        }
      } else {
          $scope.predicate = 'start_date'
          $scope.sortState = "Sort by Event Title"
      }
    }

    $scope.daysSinceEnded = function (date) {
      var date1 = new Date(date);
      var date2 = new Date();
      var timeDiff = Math.abs(date2.getTime() - date1.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return diffDays;
    }

    $scope.randomMode = 'Turn On Random Mode';

    $scope.toggleRandomMode = function () {
      $('.close-button').click()
      $('.wrapper-wrapper').toggleClass('hidden');
      $('.eventstack').toggleClass('hidden');
      $('.eventstack-info').toggleClass('hidden');
      $('.hide-in-random-mode').toggleClass('hidden');

      if ($scope.randomMode === 'Turn On Random Mode') {
        $scope.randomMode = 'Turn OFF Random Mode';
      } else {
        $scope.randomMode = 'Turn On Random Mode';
      }

        window.setupEventstack();
    }
}]);
