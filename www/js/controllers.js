angular.module('linguazone.controllers', [])

.controller('ClassPageCtrl', function($scope, ClassPageItems) {
  ClassPageItems.getAll().then(function(response) {
    $scope.course = response.course;
    $scope.available_games = response.games;
    $scope.available_word_lists = response.word_lists;
    $scope.available_posts = response.posts;
  })
})

.controller('PlayGameCtrl', function($scope, $stateParams, ClassPageItems) {
  console.log($stateParams);
  var agId = $stateParams.agId;
  ClassPageItems.getGameInfo(agId).then(function(response) {
    $scope.ag = response;
  })
})

.controller('RecentCtrl', function($scope, $http, RecentItems) {
  RecentItems.getAll().then(function(response) {
    $scope.feed_items = response;
  })
})

.controller('AccountCtrl', function($scope) {
  console.log("testing...");
  $scope.settings = {
    enableFriends: true
  };
});
