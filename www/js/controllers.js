/*global
    $: true,
    require: true,
    process: true,
    angular: true,
    console: true,
    Lgz: true
 */
/*jslint  nomen: true, sloppy: true */
angular.module('linguazone.controllers', [])

.controller('ClassPageCtrl', function($scope, ClassPageItems, StudentInfo) {  
  $scope.course = ClassPageItems.course;
  
  $scope.$watch(
    function() { return StudentInfo.currentCourse; },
    function(newVal, oldVal) {
      if ($scope.course.info.id != newVal.id && newVal.id != 0) {
        ClassPageItems.updateAll(newVal.id);
      }
    });
})

.controller('PlayGameCtrl', function($scope, $stateParams, ClassPageItems) {
  console.log('PlayGameCtrl:');
  console.log($stateParams);
  var agId = $stateParams.agId;
  console.log('ClassPageItems:getGameInfo:before');

  $scope.$on('$ionicView.loaded', function () {
      console.log('PlayGameCtrl: $ionicView.loaded');
  });

  $scope.$on('$ionicView.enter', function () {
      console.log('PlayGameCtrl: $ionicView.entered');
      Lgz.initMsgFrameNative();
  });
  
  ClassPageItems.getGameInfo(agId).then(function(response) {
    $scope.ag = response;
    console.log(response);
  })
})

.controller('ReviewWordListCtrl', function($scope, $stateParams, ClassPageItems) {
  var awlId = $stateParams.awlId;
  ClassPageItems.getWordListInfo(awlId).then(function(response) {
    $scope.list = response;
    $scope.nodes = new X2JS().xml_str2json(response.xml).gamedata.node;
  })
})

.controller('ViewPostCtrl', function($scope, $stateParams, StudentInfo, ClassPageItems, Recorder) {
  var apId = $stateParams.apId;
  $scope.user = StudentInfo.user;
  
  $scope.recordAudio = function() {
    Recorder.recordAudio({limit: 1, duration: 600}).then(function(result) {
      console.log("ViewPostCtrl :: recordAudio() :: ",result);
    }, function(err) {
      console.log("ViewPostCtrl :: recordAudio() :: ",err);
    });
  };
  
  $scope.tmp = function() {
    console.log($scope.user, "::", StudentInfo.user);
  }
  
  $scope.commentByCurrentUser = function(comment) {
    return comment.user_id == $scope.user.info.id;
  }
  
  $scope.commentByTeacher = function(comment) {
    return comment.user_id == $scope.post.user_id;
  }
  
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

.controller('AccountCtrl', function($scope, $rootScope, $http, $auth, $window, $state, StudentInfo) {
  $scope.sortRegistration = function(reg) {
    console.log("sorting registration...",reg);
    return new Date(reg.created_at);
  }
  
  $scope.student = StudentInfo.user;
  
  $scope.$watch(
    function() { return $window.localStorage["recent_courses"]; },
    function(newVal, oldVal) {
      $scope.updateRecentCourses();
    }
  )
  $scope.updateRecentCourses = function() {
    if ($window.localStorage["recent_courses"]) {
      $scope.recentCourses = angular.fromJson($window.localStorage["recent_courses"]).courses;
    } else {
      $scope.recentCourses = [];
    };
  };
  $scope.updateRecentCourses();
  
  $scope.visitClassPage = function(courseId) {
    StudentInfo.currentCourse = {id: courseId};
    $state.go('app.classpage');
  }
  
  $rootScope.$on('auth:login-success', function(ev, user) {
    StudentInfo.updateStudentInfo($auth.user.uid);
  });
  
  $scope.handleSignOut = function() {
    $auth.signOut()
      .then(function(resp) {
        $scope.student = {};
        $scope.currentCourse = { id: 0 };
        $scope.registrations = [];
      })
      .catch(function(resp) {
        console.log("Could not log out!", resp);
      })
  }
})

.controller('StateShowCtrl', function($scope, $stateParams, States) {
  States.show($stateParams.stateId).then(function(response) {
    $scope.state = response.state;
    $scope.schools = response.schools;
  });
})

.controller('SchoolShowCtrl', function($scope, $state, $stateParams, $ionicPopup, $auth, Schools, StudentInfo) {
  Schools.show($stateParams.schoolId).then(function(response) {
    $scope.courses = response.courses;
    $scope.school = response.school;
  });
  
  $scope.showClassCodePopup = function(course, tryAgain) {
    $scope.data = {};
    var ref = this;
    ref.course = course;
    var classCodePopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.class_code" placeholder="Class code" autofocus />',
      title: tryAgain ? "Please try again" : "Please enter the class code",
      subTitle: tryAgain ? "The password you entered was incorrect" : "This page is password protected",
      scope: $scope,
      buttons: [
        {text: 'Cancel'},
        {
          text: '<strong>Submit</strong>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.class_code) {
              e.preventDefault();
            } else {
              return $scope.data.class_code;
            }
          }
        }
      ]
    });
    classCodePopup.then(function(response) {
      if (response) {
        if (response == ref.course.code) {
          StudentInfo.createRegistration(ref.course.id).then(function(response) {
            StudentInfo.currentCourse = {id: response.course_registration.course_id};
            StudentInfo.user.registrations.push(response.course_registration);
            $state.go('app.classpage');
          });
        } else {
          $scope.showClassCodePopup(ref.course, true);
        }
      }
    });
  }
  
  $scope.addClassPage = function(course) {
    if (course.login_required && $auth.user.signedIn) {
      $scope.showClassCodePopup(course);
    } else if (course.login_required) {
      $ionicPopup.alert({
        title: "Password protected",
        template: "That class page is password protected. Please login to an account first."
      }).then(function(resp) {
        $state.go('app.account');
      })
    } else {
      StudentInfo.addRecentCourse(course);
      StudentInfo.currentCourse = {id: course.id};
      $state.go('app.classpage');
    }
  }
})

.controller('RegistrationCtrl', function($scope, States) {
  States.getAll().then(function(response) {
    $scope.domestic = response.domestic;
    $scope.intl = response.intl;
  });
})

.controller('NewUserCtrl', function($scope, $state, $ionicPopup, $ionicHistory, $auth, StudentInfo) {
  $scope.newUserData = {};
  $scope.submitNewUserForm = function() {
    $scope.newUserData.role = "student";
    console.log("NewUserCtrl :: ",$scope.newUserData);
    StudentInfo.createUser($scope.newUserData).then(function(response) {
      console.log("NewUserCtrl :: request issued :: ",response);
      var loginData = {};
      loginData.email = $scope.newUserData.email;
      loginData.password = $scope.newUserData.password;
      loginData.role = "student";
      $auth.submitLogin(loginData).then(function(response) {
        console.log("NewUserCtrl :: success :: logged in and redirecting");
        $ionicHistory.currentView($ionicHistory.backView());
        $state.go('app.account', {location: 'replace'});
      });
    }).catch(function(response) {
      console.log("NewUserCtrl :: request failed :: ",response);
      $ionicPopup.alert({
        title: "Problem creating account",
        template: "There was an error creating your account. Please check for errors and try again."
      })
    });
  }
})

.controller('LoginFormCtrl', function($scope, $rootScope, $auth, $state, StudentInfo) {
  $scope.loginData = {};
  
  $scope.submitLoginInfo = function() {
    $scope.loginData.role = "student";
    $auth.submitLogin($scope.loginData).then(function(resp) {
        $state.go('app.account');
    });
    $rootScope.$on('auth:login-error', function(ev, reason) {
      $scope.error = "Login failed. "+reason.message;
      $scope.loginData.password = "";
    });
  }
});