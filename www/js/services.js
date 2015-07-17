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
  var course = {info: {}, available_games: [], available_word_lists: [], available_posts: []};
  return {
    updateAll: function(courseId) {
      return $http.get(API.url+"courses/"+courseId).then(function(response) {
        course.info = response.data.course;
        course.available_games = response.data.games;
        course.available_word_lists = response.data.word_lists;
        course.available_posts = response.data.posts;
        return course;
      });
    },
    getGameInfo: function(agId) {
      return $http.get(API.url+"available_games/"+agId).then(function(response) {
        return response.data;
      });
    },
    getWordListInfo: function(awlId) {
      return $http.get(API.url+"available_word_lists/"+awlId).then(function(response) {
        return response.data;
      });
    },
    getPostInfo: function(apId) {
      return $http.get(API.url+"available_posts/"+apId).then(function(response) {
        return response.data;
      })
    },
    course: course
  }
})

.factory('RecentItems', function($http, API, StudentInfo) {
  return {
    getAll: function() {
      return $http.get(API.url+"feed_items/student/"+StudentInfo.user.info.id).then(function(response) {
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
  return {
    updateStudentInfo: function(sid) {
      return $http.get(API.url+"students/"+sid).then(function(response) {
        user.info = response.data.student_data.student;
        user.registrations = response.data.student_data.registrations;
        var lastReg = response.data.student_data.registrations[response.data.student_data.registrations.length-1];
        currentCourse = {id: lastReg.course_id};
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
    },
    user: user,
    currentCourse: currentCourse
  }
})