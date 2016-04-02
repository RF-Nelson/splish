var app = angular.module('splish',['ngMaterial', 'pusher-angular', 'ng-rails-csrf']);

app.controller('EventController', ['$scope', '$http', '$pusher', '$mdDialog', function($scope, $http, $pusher, $mdDialog) {
  $scope.events;

  var client = new Pusher('28994c89518c14262f75');
  var pusher = $pusher(client);
  var my_channel = pusher.subscribe('test_channel');
  my_channel.bind('my_event',
    function (data) {
      $scope.status = data.message;
    })

  $http.get('/api/events/').then(function (response) {
    $scope.events = angular.fromJson(response.data[0]);
    $scope.newEvent = angular.fromJson(response.data[1]);
  }).then(function () {
      $scope.events = $scope.events.start_date
  })

  $scope.showConfirm = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Would you like to delete your debt?')
          // .textContent('All of the banks have agreed to forgive you your debts.')
          // .ariaLabel('Lucky day')
          // .targetEvent(ev)
          .ok('Please do it!')
          .cancel('Sounds like a scam');
    $mdDialog.show({template : '<form action="./api/events/" method="post"><input type="hidden" name="event[owner_id]" value="<%= current_user.id %>"><label>Event title<input type="text" name="event[title]" value="<%= @event.title %>"></label><br><label>Start Date<input type="date" name="event[start_date]" value="<%= @event.start_date %>"></label><br><label>End Date<input type="date" name="event[end_date]" value="<%= @event.end_date %>"></label><br><label>Location<input type="text" name="event[location]" value="<%= @event.location %>"></label><br><label>Description<textarea name="event[description]" rows="8" cols="40"><%= @event.description %></textarea></label><br><button name="Create New Event">Create New Event</button></form>'}).then(function() {
      $scope.status = 'You decided to get rid of your debt.';
    }, function() {
      $scope.status = 'You decided to keep your debt.';
    });
  };
}]);
