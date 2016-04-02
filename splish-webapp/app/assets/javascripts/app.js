var app = angular.module('splish',['ngMaterial', 'pusher-angular', 'ng-rails-csrf']);

app.controller('EventController', ['$scope', '$http', '$pusher', '$mdDialog', function($scope, $http, $pusher, $mdDialog) {
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

  $scope.dialog;

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

  $scope.showConfirm = function(ev) {
    $mdDialog.show({template :
      '<form name="messageForm" ng-controller="EventController" ng-submit="submitForm()"' +
        '<label>Event title<input type="text" name="title" ng-model=message.title value="Event Title"></label>' +
        '<br>' +
        '<label>Start Date<input type="date" name="start_date" ng-model=message.start_date value="Start Date"></label>' +
        '<br>' +
        '<label>End Date<input type="date" name="end_date" ng-model=message.end_date value="End Date"></label>' +
        '<br>' +
        '<label>Location<input type="text" name="location" ng-model=message.location value="Location"></label>' +
        '<br>' +
        '<label>Description<textarea name="description" ng-model=message.description rows="8" cols="40">Describe your event</textarea></label>' +
        '<br>' +
        '<button type="submit" class="btn btn-primary">Create New Event</button>' +
      '</form>'
    })
  };



}]);
