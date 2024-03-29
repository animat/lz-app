/*global
    $: true,
    require: true,
    process: true,
    angular: true,
    console: true,
    K: true

 */
/*jslint  nomen: true, sloppy: true */

angular.module('linguazone.services', [])

.factory('Recorder', ['$q', '$http', function($q, $http) {
  return {
    recordAudio: function(options) {
      var q = $q.defer();
      console.log("Recorder :: recordAudio() :: beginning device capture");
      navigator.device.capture.captureAudio(function(result) {
        console.log("Success!", result);
        q.resolve(result);
      }, function(err) {
        console.log("Error recording.",err);
        q.reject(err);
      }, options);

      return q.promise;
    },
    getAudioBlob: function(filePath) {
      var thisObj = this;
      var q = $q.defer();
      
      var successCallback = function(fileEntry) {
        fileEntry.file(function(file) {
          var reader = new FileReader();
          reader.onloadend = function(evt) {
            var blob = new Blob([evt.target.result]);
            q.resolve(blob);
          }
          reader.readAsArrayBuffer(file);
        })
      }
      var errorCallback = function(error) {
        q.reject(error);
        return false;
      }
      window.resolveLocalFileSystemURL(filePath, successCallback, errorCallback);
      return q.promise;
    },
    createComment: function(newComment) {
      console.log("Issuing createComment() and passing along... ",newComment);
      return $http.post(K.baseUrl.api+"/comments", newComment).then(function(response) {
        console.log("Successfully saved comment! ",response);
        return response;
      });
    }
  }
}])

.factory('ClassPageItems', function($http) {
  var course = {info: {}, available_games: [], available_word_lists: [], available_posts: []};
  return {
    updateAll: function(courseId) {
      return $http.get(K.baseUrl.api+"/courses/"+courseId).then(function(response) {
        course.info = response.data.course;
        course.available_games = response.data.games;
        course.available_word_lists = response.data.word_lists;
        course.available_posts = response.data.posts;
        return course;
      });
    },
    getGameInfo: function(agId) {
      return $http.get(K.baseUrl.api+"/available_games/"+agId).then(function(response) {
        return response.data;
      });
    },
    getWordListInfo: function(awlId) {
      return $http.get(K.baseUrl.api+"/word_lists/"+awlId).then(function(response) {
        return response.data;
      });
    },
    getPostInfo: function(apId) {
      return $http.get(K.baseUrl.api+"/posts/"+apId).then(function(response) {
        return response.data;
      })
    },
    pageIsEmpty: function() {
      return course.available_games.length == 0 && course.available_word_lists.length == 0 && course.available_posts.length == 0;
    },
    course: course
  }
})

.factory('RecentItems', function($http, StudentInfo) {
  return {
    getAll: function(sId) {
      return $http.get(K.baseUrl.api+"/feed_items/student/"+sId).then(function(response) {
        return response.data;
      });
    }
  }
})

.factory('States', function($http) {
  return {
    getAll: function() {
      return $http.get(K.baseUrl.api+"/states").then(function(response) {
        return response.data;
      });
    },
    show: function(id) {
      return $http.get(K.baseUrl.api+"/states/"+id).then(function(response) {
        return response.data;
      });
    }
  }
})

.factory('Schools', function($http) {
  return {
    show: function(id) {
      return $http.get(K.baseUrl.api+"/schools/"+id).then(function(response) {
        return response.data;
      })
    }
  }
})

.factory('StudentInfo', function($http, $window) {
  var currentCourse = { id: 0 };
  var user = { info: {}, registrations: [] };
  return {
    updateStudentInfo: function(sid) {
      return $http.get(K.baseUrl.api+"/students/"+sid).then(function(response) {
        user.info = response.data.student_data.student;
        user.registrations = response.data.student_data.registrations;
        var lastReg = response.data.student_data.registrations[response.data.student_data.registrations.length-1];
        if (lastReg) {
          currentCourse = { id: lastReg.course_id };
        } else {
          currentCourse = { id: 0 };
        }
        return response.data;
      })
    },
    createRegistration: function(cId) {
      return $http.post(K.baseUrl.api+"/course_registrations", {courseId: cId}).then(function(response) {
        return response.data;
      });
    },
    addRecentCourse: function(newCourse) {
      var recentCoursesJson = angular.fromJson($window.localStorage["recent_courses"]);
      if (recentCoursesJson) {
        var courses = recentCoursesJson.courses;
        for (var i = 0; i < courses.length; i++) {
          if (courses[i].id == newCourse.id) {
            courses.splice(i, 1);
          }
        }
        courses.unshift(newCourse);
        if (courses.length > 5) {
          courses.pop();
        }
      } else {
        recentCoursesJson = { courses: [newCourse] };
      }
      $window.localStorage["recent_courses"] = angular.toJson(recentCoursesJson);      
    },
    validateUniqueEmail: function(email) {
      return $http.post(K.baseUrl.api+"/students/validate_unique_email", {email: email}).then(function(response) {
        console.log("services.js :: StudentInfo :: validateUniqueEmail :: response.data :: ",response.data);
        return response.data;
      })
    },
    createUser: function(newUser) {
      return $http.post(K.baseUrl.api+"/students", newUser).then(function(response) {
        return response.data;
      })
    },
    user: user,
    currentCourse: currentCourse
  }
})