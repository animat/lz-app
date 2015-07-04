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
  var agId = $stateParams.agId;
  ClassPageItems.getGameInfo(agId).then(function(response) {
    $scope.ag = response;
  })
})

.controller('ReviewWordListCtrl', function($scope, $stateParams, ClassPageItems) {
  var awlId = $stateParams.awlId;
  ClassPageItems.getWordListInfo(awlId).then(function(response) {
    $scope.list = response;
    $scope.nodes = new X2JS().xml_str2json(response.xml).gamedata.node;
  })
})

.controller('ViewPostCtrl', function($scope, $stateParams, ClassPageItems, Recorder) {
  var apId = $stateParams.apId;
  
  $scope.recordAudio = function() {
    Recorder.recordAudio({limit: 1, duration: 600}).then(function(result) {
      console.log(result);
    }, function(err) {
      console.log(err);
    });
  };
  
  ClassPageItems.getPostInfo(apId).then(function(response) {
    $scope.post = angular.fromJson(response.post);
    $scope.comments = angular.fromJson(response.comments);
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
