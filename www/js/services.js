angular.module('linguazone.services', [])

.constant('API', {
  url: 'http://localhost:3000/api/v2/'
})

.factory('Recorder', ['$q', function($q) {
  return {
    recordAudio: function(options) {
      var q = $q.defer();

      navigator.device.capture.captureAudio(function(result) {
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    }
  }
}])

.factory('ClassPageItems', function($http, API) {
  return {
    getAll: function(courseId) {
      return $http.get(API.url+"courses/"+courseId).then(function(response) {
        return response.data;
      });
    },
    getGameInfo: function(agId) {
      return $http.get(API.url+"games/"+agId).then(function(response) {
        return response.data;
      });
    },
    getWordListInfo: function(awlId) {
      return $http.get(API.url+"word_lists/"+awlId).then(function(response) {
        return response.data;
      });
    },
    getPostInfo: function(apId) {
      return $http.get(API.url+"posts/"+apId).then(function(response) {
        return response.data;
      })
    }
  }
})

.factory('RecentItems', function($http, API) {
  return {
    getAll: function() {
      return $http.get(API.url+"feed_items/student/10052").then(function(response) {
        return response.data;
      });
    }
  }
})

.factory('States', function($http, API) {
  return {
    getAll: function() {
      return $http.get(API.url+"states").then(function(response) {
        return response.data;
      });
    },
    show: function(id) {
      return $http.get(API.url+"states/"+id).then(function(response) {
        return response.data;
      });
    }
  }
})

.factory('Schools', function($http, API) {
  return {
    show: function(id) {
      return $http.get(API.url+"schools/"+id).then(function(response) {
        return response.data;
      })
    }
  }
})

.factory('StudentInfo', function($http, $window, API) {
  var currentCourse = { id: 0 };
  var user = { info: {}, registrations: [] };
  var factory = this;
  return {
    updateStudentInfo: function(sid) {
      return $http.get(API.url+"students/"+sid).then(function(response) {
        user.info = response.data.student_data.student;
        user.registrations = response.data.student_data.registrations;
        var lastReg = response.data.student_data.registrations[response.data.student_data.registrations.length-1];
        currentCourse = {id: lastReg.course_id};
        console.log("StudentInfo.updateStudentInfo() :: user.registrations... ",user.registrations);
        return response.data;
      })
    },
    createRegistration: function(cId) {
      return $http.post(API.url+"course_registrations", {courseId: cId}).then(function(response) {
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
      console.log("lets see if addRecentCourse has access to the variable: ",currentCourse);
    },
    user: user,
    currentCourse: currentCourse
  }
})