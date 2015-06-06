angular.module('starter.controllers', [])

.controller('ClassPageCtrl', function($scope, $http, API) {
  $http.get(API.url+"courses/1866").success(function(resp) {
    $scope.course = resp.course;
    $scope.available_games = resp.games;
    $scope.available_word_lists = resp.word_lists;
    $scope.available_posts = resp.posts;
  }).error(function(resp) {
    // TODO: Throw an error
    $scope.games = resp;
  });
})

.controller('RecentCtrl', function($scope, $http, API) {
  $http.get(API.url+"feed_items/student/10052").success(function(resp) {
    $scope.feed_items = resp;
  }).error(function(resp) {
    // TODO: Throw an error
    $scope.feed_items = resp;
  })
})

.controller('PlayGameCtrl', function($scope, $stateParams, $http, API) {
  $scope.game = {"activity": "test"};
  /*$http.get(API.url+"games/"+$stateParams.agId).success(function(resp) {
    $scope.game = resp;
  }).error(function(resp) {
    //TODO: Throw an error
    $scope.game = resp;
  })*/
})

.controller('AccountCtrl', function($scope) {
  console.log("testing...");
  $scope.settings = {
    enableFriends: true
  };
});
