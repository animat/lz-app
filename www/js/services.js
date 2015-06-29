/*global
    $: true,
    require: true,
    process: true,
    angular: true,
    console: true
 */
/*jslint  nomen: true, sloppy: true */
angular.module('linguazone.services', [])
    .factory('ClassPageItems', function ($http, API) {
        return {
            getAll: function () {
                return $http.get(API.url  +  "courses/1866")
                    .then(function (response) {
                        return response.data;
                    });
            },
            getGameInfo: function (agId) {
                return $http.get(API.url  +  "games/"  +  agId)
                    .then(function (response) {
                        return response.data;
                    });
            }
        };
    })
    .factory('RecentItems', function ($http, API) {
        return {
            getAll: function () {
                return $http.get(API.url  +  "feed_items/student/10052")
                    .then(function (response) {
                        return response.data;
                    });
            }
        };
    })
    .factory('StudentInfo', function ($http, API) {
        return {
            getStudentInfo: function (sid) {
                return $http.get(API.url + "students/" + sid)
                    .then(function (response) {
                        return response.data;
                    });
            }
        };
    });
