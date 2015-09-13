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
  $scope.title = "Welcome to LinguaZone";
  
  $scope.updatePageState = function() {
    $scope.hasCourseSelected = ClassPageItems.course.info.hasOwnProperty("name");
    $scope.hasContent = !$scope.blank && !ClassPageItems.pageIsEmpty();
    $scope.title = ClassPageItems.course.info.name+" class page" || "Welcome to LinguaZone";
  };
  
  $scope.$watch(
    function() { return StudentInfo.currentCourse; },
    function(newVal, oldVal) {
      if ($scope.course.info.id != newVal.id && newVal.id != 0) {
        ClassPageItems.updateAll(newVal.id).then(function(response) {
          $scope.updatePageState();
        });
      }
    });
})

.controller('PlayGameCtrl', function($scope, $stateParams, $ionicPopup, ClassPageItems, StudentInfo) {
  console.log('PlayGameCtrl:');
  console.log($stateParams);
  var agId = $stateParams.agId;
  console.log('ClassPageItems:getGameInfo:before');

  $scope.$on('$ionicView.loaded', function () {
      console.log('PlayGameCtrl: $ionicView.loaded');
  });

  $scope.$on('$ionicView.enter', function () {
      console.log('PlayGameCtrl: $ionicView.entered');
  });
  
  $scope.playerId = StudentInfo.user.info.id || 0;
  
  ClassPageItems.getGameInfo(agId).then(function(response) {
    $scope.ag = response;
    Lgz.initMsgFrameNative($scope, $ionicPopup);
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

.controller('ViewPostCtrl', function($scope, $state, $stateParams, $sce, StudentInfo, ClassPageItems, Recorder) {
  var apId = $stateParams.apId;
  $scope.user = StudentInfo.user;
  
  // Init audio recorder variables
  $scope.recordingPath = null;
  $scope.newComment = {};
  $scope.newComment.userId = StudentInfo.user.info.id;
  $scope.newComment.availablePostId = $stateParams.apId;
  $scope.newComment.audioId = 0;
  $scope.transloaditParams = angular.fromJson({
    auth: { key: "79af1338b0364303b9caa569fc37641f" },
    template_id: "3e01cb70b1a611e49853952f7f0c814f",
    expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  });
  
  // Init Transloadit with success callbacks to submit form
  $("#uploadAudio").transloadit({
    wait: true,
    interval: 2500,
    pollTimeout: 8000,
    poll404Retries: 20,
    autoSubmit: false,
    onSuccess: function(assembly) {
      console.log("Successfully uploaded! ",assembly);
      $scope.newComment.audioId = assembly.assembly_id;
      console.log("And successfully updated the newComment ",$scope.newComment);
      $scope.submitForm();
      return false;
    },
    onError: function(assembly) {
      $ionicPopup.alert({
        title: "Error",
        template: "We're sorry, there has been an error uploading your comment. Please try again."
      })
    }
  });
  
  // Use Recorder service to record audio; store path on success callback
  $scope.recordAudio = function() {
    Recorder.recordAudio({limit: 1, duration: 600}).then(function(result) {
      $scope.recordingPath = cordova.file.tempDirectory + result[0].name;
    }, function(err) {
      console.log("ViewPostCtrl :: recordAudio() fail :: ",err);
    });
  };
  
  // Get the audio blob and trigger transloadit
  $scope.uploadAndSubmit = function() {
    var $form = $("#uploadAudio");
    Recorder.getAudioBlob($scope.recordingPath).then(function(result) {
      fd = [];
      fd.push(["file", result, "blob.wav"]);
      uploader = $form.data('transloadit.uploader');
      uploader._options.formData = fd;
      $form.trigger('submit.transloadit');
    }), function(error) {
      console.log("Transloadit - beforestart -- failed!",error);
    }
  }
  
  // Create a new Comment and submit to the backend on Transloadit success callback
  $scope.submitForm = function() {
    Recorder.createComment($scope.newComment).then(function(response) {
      $state.go($state.current, {}, {reload: true});
    }).catch(function(response) {
      console.log("Error creating comment! ",response);
    })
  }
  
  $scope.commentByCurrentUser = function(comment) {
    return comment.user_id == $scope.user.info.id;
  }
  
  $scope.commentByTeacher = function(comment) {
    return comment.user_id == $scope.post.user_id;
  }
  
  $scope.getNumber = function(num) {
    return new Array(num);
  }
  
  $scope.vgTheme = "http://www.videogular.com/styles/themes/default/latest/videogular.css";
  
  ClassPageItems.getPostInfo(apId).then(function(response) {
    $scope.post = angular.fromJson(response.post);
    $scope.comments = angular.fromJson(response.comments);
  })
})

.controller('RecentCtrl', function($scope, $http, RecentItems, StudentInfo) {
  $scope.$on('$ionicView.enter', function () {
    $scope.hasUser = StudentInfo.user.info.hasOwnProperty("id");
  });
  if (StudentInfo.user.info.id) {
    RecentItems.getAll(StudentInfo.user.info.id).then(function(response) {
      $scope.feed_items = response.data.feed_items;
      $scope.hasActivity = $scope.feed_items.length != 0;
    })
  }
})

.controller('AccountCtrl', function($scope, $rootScope, $http, $auth, $window, $state, $ionicPopup, StudentInfo, Recorder) {
  
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
    StudentInfo.createUser($scope.newUserData).then(function(response) {
      var loginData = {};
      loginData.email = $scope.newUserData.email;
      loginData.password = $scope.newUserData.password;
      loginData.role = "student";
      $auth.submitLogin(loginData).then(function(response) {
        $ionicHistory.currentView($ionicHistory.backView());
        $state.go('app.account', {location: 'replace'});
      });
    }).catch(function(response) {
      $ionicPopup.alert({
        title: "Problem creating account",
        template: "There was an error creating your account. Please check for errors and try again."
      })
    });
  }
})

.controller('LoginFormCtrl', function($scope, $rootScope, $timeout, $auth, $state, StudentInfo) {
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
