var app = angular.module('splish',['ngMaterial', 'pusher-angular', 'ng-rails-csrf', 'ngMaterialDatePicker']);

app.factory('eventService', ['$http', function($http) {
  var eventService = {};
  eventService.events = []

  eventService.getEvents = function () {
    return $http.get('/api/events/').then(function (response) {
      eventService.events = angular.fromJson(response.data);
      return eventService.events;
    })
  }

  eventService.updateEvent = function (data) {
    for (var i = 0; i < eventService.events.length; i++) {
      if (eventService.events[i].id === data.id) {
        eventService.events[i] = data;
        break;
      }
    }
    return eventService.events;
  }

  return eventService;
}]);

app.controller('EventController', ['$scope', '$http', '$pusher', '$mdDialog', '$q', '$timeout', '$rootScope', 'eventService', '$mdToast', function($scope, $http, $pusher, $mdDialog, $q, $timeout, $rootScope, eventService, $mdToast) {
  eventService.getEvents().then(function(events) {
    $scope.events = events;
  })

  $scope.filterForTBD = function(element) {
    if (!element.start_date) {
      return element;
    }
  };

  $scope.filterForNotTBD = function(element) {
    if (element.start_date) {
      return element;
    }
  };

  $scope.predicate = 'start_date';
  $scope.reverse = false;
  $scope.dateTimeStart;

  $rootScope.$watch(
    function () {
      return eventService.events;
    },
    function (newValue, oldValue) {
      $scope.events = newValue;
    },
    true
  )

  $scope.newEventReceived = false;
  $scope.newEvents = [];
  var dataDiv = document.getElementById('div-item-data');
  if (dataDiv) {
    $scope.user_id = dataDiv.getAttribute('data-user-id');
  }
  var client = new Pusher('28994c89518c14262f75');
  var pusher = $pusher(client);
  var my_channel = pusher.subscribe('test_channel');
  my_channel.bind('my_event',
    function (data) {
      $scope.newEventReceived = true;
      $scope.newEvents.unshift(data.message);
    })

  // $http.get('/api/events/').then(function (response) {
  //   $scope.events = angular.fromJson(response.data);

    // var parsedData = angular.fromJson(response.data);
    // parsedData.forEach(function (event) {
    //   $scope.events.push(event)
    // })

  // })//.then(function () {
  // })

  $scope.message = {};

  $scope.submitForm = function () {
    var message = "Your event is missing "

    if (!$scope.message.location) {
      $scope.showActionToast(message + "a location.")
      return
    } else if (!$scope.message.description) {
      $scope.showActionToast(message + "a description.")
      return
    } else if (!$scope.message.title) {
      $scope.showActionToast(message + "a title.")
      return
    // } else if (!$scope.message.start_date) {
      // $scope.showActionToast(message + "a start date.")
      // $scope.message.message.start_date = ''
      // return
    // } else if (!$scope.message.end_date) {
      // $scope.showActionToast(message + "an end date.")
      // $scope.message.message.end_date = ''
      // return
    } else if (new Date($scope.message.start_date).getDate() > new Date($scope.message.end_date).getDate()) {
      $scope.showActionToast("Please make sure the end date comes after the start date of your event.")
      return
    }

    $scope.message.owner_id = $scope.user_id;
    $http({
      method  : 'POST',
      url     : './api/events/',
      data    : { data: $scope.message },
      headers : {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function (data) {
      if (data.status === 200) {
        $scope.message = {};
        $mdDialog.hide()
      }
    })
  }

  $scope.submitEditForm = function (id) {
    $http({
      method  : 'PUT',
      url     : './api/events/' + id,
      data    : { data: $scope.message },
      headers : {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function (data) {
      if (data.status === 200) {
        $mdDialog.hide()
        $http.get('/api/events/' + id).then(function (response) {
          $scope.events = eventService.updateEvent(response.data);
          $scope.message = {};
        })
      }
    })
  }

  $scope.rsvp = function (eventID) {
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

  $scope.dersvp = function (eventID) {
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
    // console.log(event.guests);
    // console.log($scope.user_id);
    for (var i = 0; i < event.length; i++) {
      if (event[i].id == $scope.user_id) {
        return true;
      }
    }
    return false;
  }

  $scope.showNewEventModal = function(ev) {
    $mdDialog.show({template :
      '<form id="modal-form" name="messageForm" ng-controller="EventController" ng-submit="submitForm()">' +
        '<label>Event title<input id="title" type="text" name="title" ng-model="message.title" value="Event Title"></label>' +
        '<br>' +
        '<label id="start_date">Start Date<input type="datetime-local" name="start_date" ng-model="message.start_date" value="Start Date"></label>' +
        '<br>' +
        '<label id="start_date">End Date<input type="datetime-local" name="end_date" ng-model="message.end_date" value="End Date"></label>' +
        '<br>' +
        '<div class="google-map">' +
          '<md-autocomplete id="Location" md-no-cache="true"' +
             'md-selected-item="selectedItem"' +
             'md-selected-item-change="selectedItemChange(item)"' +
             'md-search-text-change="search(searchText); selectedItemChange(searchText)"' +
             'md-search-text="searchText"' +
             'md-items="item in search(searchText)"' +
             'md-item-text="item"' +
             'md-min-length="1"' +
             'placeholder="Type your address">' +
            '<md-item-template>' +
              '<span md-highlight-text="searchText" md-highlight-flags="^i">{{item}}</span>' +
            '</md-item-template>' +
          '</md-autocomplete>' +
        '</div>' +
        '<br>' +
        '<label id="description">Description<textarea name="description" ng-model="message.description" rows="8" cols="40">Describe your event</textarea></label>' +
        '<br>' +
        '<button name="Create New Event" type="submit" class="btn btn-primary">Create New Event</button>' +
      '</form>',
      clickOutsideToClose: true
    })
  };

  $scope.showEditEventModal = function(ev, event) {
    $scope.message = {};

    $mdDialog.show({template :
      '<form id="modal-form" name="messageForm" ng-controller="EventController" ng-submit="submitEditForm(' + event.id + ')">' +
        '<label>Event title<input id="title" type="text" name="title" ng-model="message.title"></label>' +
        '<br>' +
        '<label id="start_date">Start Date<input id="start_date_picker" type="date" name="start_date" ng-model="message.start_date" ></label>' +
        '<br>' +
        '<label id="end_date">End Date<input id="end_date_picker" type="date" name="end_date" ng-model="message.end_date" ></label>' +
        '<br>' +
        '<div class="google-map">' +
          '<md-autocomplete id="Location" md-no-cache="true"' +
             'md-selected-item="selectedItem"' +
             'md-selected-item-change="selectedItemChange(item)"' +
             'md-search-text-change="search(searchText); selectedItemChange(searchText)"' +
             'md-search-text="searchText"' +
             'md-items="item in search(searchText)"' +
             'md-item-text="item"' +
             'md-min-length="1"' +
             'placeholder="Type your address">' +
            '<md-item-template>' +
              '<span md-highlight-text="searchText" md-highlight-flags="^i">{{item}}</span>' +
            '</md-item-template>' +
          '</md-autocomplete>' +
        '</div>' +
        '<br>' +
        '<label id="description">Description<textarea id="event_description" name="description" ng-model="message.description" rows="8" cols="40" ng-init="message.description =\'' + event.description + '\'" value="' + event.description + '"></textarea></label>' +
        '<br>' +
        '<button name="Change Event" type="submit" class="btn btn-primary">Change Event</button>' +
      '</form>',
      clickOutsideToClose: true
    })

    if (event.start_date && event.end_date) {
      var datesPresent = true;
    }

    if (datesPresent) {
      var startDateString = event.start_date.substring(0,10);
      var endDateString = event.end_date.substring(0,10);
    }

    // THE MATERIAL DESIGN DIALOG DOESN'T LIKE TO HAVE FORMS IN IT, SO WHEN
    // WE HOW THE USER THE EDIT-EVENT DIALOG, WE MANUALLY INJECT THE MODEL'S
    // PROPERTIES DIRECTLY INTO THE FORM.
    setTimeout(function () {
      if (datesPresent) {
        angular.element("#start_date_picker").val(startDateString)
        angular.element("#end_date_picker").val(endDateString)
      }
      var dateInputID = '#' + document.querySelector('[id^="input-"]').id;
      angular.element(dateInputID).val(event.location)
      angular.element("#title").val(event.title)
    }, 10)
  }

  $scope.gmapsService = new google.maps.places.AutocompleteService();

  $scope.search = search;


  function search(address) {
    if (address) {
      var deferred = $q.defer();
      getResults(address).then(
        function (predictions) {
          var results = [];
          for (var i = 0, prediction; prediction = predictions[i]; i++) {
            results.push(prediction.description);
          }
          deferred.resolve(results);
        }
      );
      return deferred.promise;
    }
  }

  function getResults(address) {
    if (address) {
      var deferred = $q.defer();
      $scope.gmapsService.getQueryPredictions({input: address}, function (data) {
        deferred.resolve(data);
      });
      return deferred.promise;
    }
  }

  $scope.selectedItemChange = function (item) {
    $scope.message.location = item;
  }

  var last = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };
  $scope.toastPosition = angular.extend({},last);
  $scope.getToastPosition = function() {
    sanitizePosition();
    return Object.keys($scope.toastPosition)
      .filter(function(pos) { return $scope.toastPosition[pos]; })
      .join(' ');
  };

  function sanitizePosition() {
    var current = $scope.toastPosition;
    if ( current.bottom && last.top ) current.top = false;
    if ( current.top && last.bottom ) current.bottom = false;
    if ( current.right && last.left ) current.left = false;
    if ( current.left && last.right ) current.right = false;
    last = angular.extend({},current);
  }

  $scope.showActionToast = function(text) {
    var toast = $mdToast.simple()
          .textContent(text)
          .hideDelay(3000)
          .position($scope.getToastPosition());
    $mdToast.show(toast).then(function(response) {
      if ( response == 'ok' ) {
        alert('You clicked \'OK\'.');
      }
    });
  };

}]);

app.controller("FormCtrl", function ($scope, $controller, eventService) {
    angular.extend(this, $controller('EventController', {$scope: $scope}));
    // eventService.getEvents().then(function(events) {
    //   $scope.events = events;
    // })
})

// app.directive('input', function ($parse) {
//   return {
//     restrict: 'E',
//     require: '?ngModel',
//     link: function (scope, element, attrs) {
//       if (attrs.ngModel && attrs.value) {
//         $parse(attrs.ngModel).assign(scope, attrs.value);
//       }
//     }
//   };
// });
