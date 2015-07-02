angular.module('linguazone.controllers', [])

.controller('ClassPageCtrl', function($scope, ClassPageItems) {
  ClassPageItems.getAll().then(function(response) {
    $scope.course = angular.fromJson(response.course);
    $scope.available_games = angular.fromJson(response.games);
    $scope.available_word_lists = angular.fromJson(response.word_lists);
    $scope.available_posts = angular.fromJson(response.posts);
  })
})

.controller('PlayGameCtrl', function($scope, $stateParams, ClassPageItems) {
  console.log($stateParams);
  var agId = $stateParams.agId;
  ClassPageItems.getGameInfo(agId).then(function(response) {
    $scope.ag = response;
  })
})

.controller('ReviewWordListCtrl', function($scope, $stateParams, ClassPageItems) {
  console.log($stateParams);
  var awlId = $stateParams.awlId;
  ClassPageItems.getWordListInfo(awlId).then(function(response) {
    $scope.awl = response;
  })
})

.controller('ViewPostCtrl', function($scope, $stateParams, ClassPageItems) {
  console.log($stateParams);
  var apId = $stateParams.apId;
  ClassPageItems.getPostInfo(apId).then(function(response) {
    $scope.ap = response;
  })
})

.controller('RecentCtrl', function($scope, $http, RecentItems) {
  RecentItems.getAll().then(function(response) {
    $scope.feed_items = response;
  })
})

.controller('AccountCtrl', function($scope, $http, StudentInfo) {
  StudentInfo.getStudentInfo(10052).then(function(response) {
    $scope.student = angular.fromJson(response.student_data.student);
    $scope.registrations = angular.fromJson(response.student_data.registrations);
    console.log($scope.student.display_name);
  })
});
