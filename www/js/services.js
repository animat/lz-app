angular.module('linguazone.services', [])

.constant('API', {
  url: '/api/v2/'
})

.factory('Games', function($http, API) {
})

.factory('ClassPageItems', function($http, API) {
  return {
    getAll: function() {
      return $http.get(API.url+"courses/1866").then(function(resp) {
        return resp;
      });
    }
  }
});
