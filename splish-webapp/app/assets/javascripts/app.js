var app = angular.module('splish',['ngMaterial', 'pusher-angular', 'ng-rails-csrf']);

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

app.controller('EventController', ['$scope', '$http', '$pusher', '$mdDialog', '$q', '$timeout', '$rootScope', 'eventService', function($scope, $http, $pusher, $mdDialog, $q, $timeout, $rootScope, eventService) {
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
    $scope.message.owner_id = $scope.user_id;
    $http({
      method  : 'POST',
      url     : './api/events/',
      data    : { data: $scope.message },
      headers : {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function (data) {
      if (data.status === 200) {
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
        })
      }
    })
  }


  $scope.showNewEventModal = function(ev) {
    $mdDialog.show({template :
      '<form id="modal-form" name="messageForm" ng-controller="EventController" ng-submit="submitForm()"' +
        '<label>Event title<input id="title" type="text" name="title" ng-model="message.title" value="Event Title"></label>' +
        '<br>' +
        '<label id="start_date">Start Date<input type="date" name="start_date" ng-model="message.start_date" value="Start Date"></label>' +
        '<br>' +
        '<label id="start_date">End Date<input type="date" name="end_date" ng-model="message.end_date" value="End Date"></label>' +
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
      '</form>'
    })
  };

  $scope.showEditEventModal = function(ev, event) {
    $scope.message = {};

    $mdDialog.show({template :
      '<form id="modal-form" name="messageForm" ng-controller="EventController" ng-submit="submitEditForm(' + event.id + ')"' +
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
        '<label id="description">Description<textarea id="event_description" name="description" ng-model="message.description" rows="8" cols="40" ng-init="message.description =' + event.description + '" value="' + event.description + '"></textarea></label>' +
        '<br>' +
        '<button name="Change Event" type="submit" class="btn btn-primary">Change Event</button>' +
      '</form>'
    })

    var startDateString = event.start_date.substring(0,10);
    var endDateString = event.end_date.substring(0,10);

    setTimeout(function () {
      angular.element("#start_date_picker").val(startDateString)
      angular.element("#end_date_picker").val(endDateString)
      angular.element("#event_description").val(event.description)
      angular.element("#input-0").val(event.location)
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
