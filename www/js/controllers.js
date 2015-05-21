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

.controller('RecentCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
