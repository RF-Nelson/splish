var app = angular.module('splish',['ngMaterial', 'pusher-angular', 'ng-rails-csrf']);

app.controller('EventController', ['$scope', '$http', '$pusher', '$mdDialog', '$q', function($scope, $http, $pusher, $mdDialog, $q) {
  $scope.events;
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

  $http.get('/api/events/').then(function (response) {
    $scope.events = angular.fromJson(response.data);
  })//.then(function () {
  // })

  var getFormToken = function () {
    var dataDiv = document.getElementById('div-item-data');
    if (dataDiv) {
      return dataDiv.getAttribute('data-form-token');
    }
  }

  $scope.message = {};

  $scope.submitForm = function () {
    $scope.message.owner_id = $scope.user_id;
    // $scope.message.authenticity_token = getFormToken();
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

  $scope.showConfirm = function(ev) {
    $mdDialog.show({template :
      '<form id="modal-form" name="messageForm" ng-controller="EventController" ng-submit="submitForm()"' +
        '<label>Event title<input id="title" type="text" name="title" ng-model=message.title value="Event Title"></label>' +
        '<br>' +
        '<label id="start_date">Start Date<input type="date" name="start_date" ng-model=message.start_date value="Start Date"></label>' +
        '<br>' +
        '<label id="start_date">End Date<input type="date" name="end_date" ng-model=message.end_date value="End Date"></label>' +
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
        '<label id="description">Description<textarea name="description" ng-model=message.description rows="8" cols="40">Describe your event</textarea></label>' +
        '<br>' +
        '<button name="Create New Event" type="submit" class="btn btn-primary">Create New Event</button>' +
      '</form>'
    })
  };

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
