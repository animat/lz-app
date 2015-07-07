angular.module('linguazone.controllers', [])

.controller('ClassPageCtrl', function($scope, ClassPageItems) {  
  $scope.getClassPageContents = function(courseId) {
    ClassPageItems.getAll(courseId).then(function(response) {
      $scope.course = angular.fromJson(response.course);
      $scope.available_games = angular.fromJson(response.games);
      $scope.available_word_lists = angular.fromJson(response.word_lists);
      $scope.available_posts = angular.fromJson(response.posts);
    })
  }
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
    console.log("Is this post shared? ",$scope.post.shared);
    $scope.comments = angular.fromJson(response.comments);
  })
})

.controller('RecentCtrl', function($scope, $http, RecentItems) {
  RecentItems.getAll().then(function(response) {
    $scope.feed_items = response;
  })
})

.controller('AccountCtrl', function($scope, $rootScope, $http, $auth, StudentInfo) {
  $rootScope.$on("auth:login-success", function() {
    console.log("auth:login-success! Updating account info...")
    $scope.updateAccountInfo();
  });
  
  $rootScope.$on("account:current-course", function(event, params) {
    $scope.currentCourse = params.courseId;
    console.log("\tBroadcast received by account ctrl");
  });
  
  $scope.sortRegistration = function(reg) {
    console.log("sorting registration...",reg);
    return new Date(reg.created_at);
  }
  
  $scope.updateCurrentCourse = function(courseId) {
    StudentInfo.setCurrentCourse(courseId);
    console.log("About to broadcast...");
    $rootScope.$broadcast('account:current-course', {'status': 'update', 'courseId': courseId});
  }
  
  $scope.updateAccountInfo = function() {
    console.log("Updating account info...",$auth);
    if ($auth.user.uid) {
      StudentInfo.getStudentInfo($auth.user.uid).then(function(response) {
        $scope.student = angular.fromJson(response.student_data.student);
        $scope.registrations = angular.fromJson(response.student_data.registrations);
        $scope.updateCurrentCourse($scope.registrations[0]);
      })
    } else {
      console.log("Sorry. no authentication.");
      $scope.student = {};
      $scope.registrations = [];
    }
  }
  
  $scope.handleSignOut = function() {
    $auth.signOut()
      .then(function(resp) {
        console.log("Logged out!",resp);
        $scope.updateAccountInfo();
      })
      .catch(function(resp) {
        console.log("Could not log out!", resp);
      })
  }
})

.controller('LoginFormCtrl', function($scope, $auth, $state) {
  $scope.loginData = {};
  
  $scope.submitLoginInfo = function() {
    $auth.submitLogin($scope.loginData)
      .then(function(resp) {
        //console.log("submitLogin() success! ",resp);
        $state.go('app.account');
      })
      .catch(function(resp) {
        $scope.loginData.password = "";
        $scope.error = "Login failed: "+resp.errors[0];
      });
  }
});
