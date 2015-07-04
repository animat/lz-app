angular.module('linguazone.services', [])

.constant('API', {
  url: '/api/v2/'
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
    getAll: function() {
      return $http.get(API.url+"courses/2495").then(function(response) {
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
  return {
    getStudentInfo: function(sid) {
      return $http.get(API.url+"students/"+sid).then(function(response) {
        return response.data;
      })
    }
  }
})