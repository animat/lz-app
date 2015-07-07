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

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = angular.toJson(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
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

.factory('StudentInfo', function($http, API) {
  var currentCourse = 0;
  return {
    getCurrentCourse: function() {
      return currentCourse;
    },
    setCurrentCourse: function(c) {
      currentCourse = c;
    },
    getStudentInfo: function(sid) {
      return $http.get(API.url+"students/"+sid).then(function(response) {
        return response.data;
      })
    }
  }
})