var app = angular.module('splish',['ngMaterial']);

app.controller('EventController', ['$scope', '$http', function($scope, $http) {
  $scope.events;

  $http.get('/api/events/').then(function (response) {
    $scope.events = angular.fromJson(response.data[0]);
  }).then(function () {
      $scope.events = $scope.events.start_date
  })

  $scope.date;
}]);
