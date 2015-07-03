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
    .factory('ClassPageItems', function ($http) {
        return {
            getAll: function () {
                return $http.get(K.baseUrl.api  +  "/courses/1866")
                    .then(function (response) {
                        return response.data;
                    });
            },
            getGameInfo: function (agId) {
                return $http.get(K.baseUrl.api  +  "/games/cginfo/"  +  agId)
                    .then(function (response) {
                        return response.data;
                    });
            }
        };
    })
    .factory('RecentItems', function ($http) {
        return {
            getAll: function () {
                return $http.get(K.baseUrl.api  +  "/feed_items/student/10052")
                    .then(function (response) {
                        return response.data;
                    });
            }
        };
    })
    .factory('StudentInfo', function ($http) {
        return {
            getStudentInfo: function (sid) {
                return $http.get(K.baseUrl.api + "/students/" + sid)
                    .then(function (response) {
                        return response.data;
                    });
            }
        };
    });
