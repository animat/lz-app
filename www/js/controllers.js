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
    .controller('ClassPageCtrl', function ($scope, ClassPageItems) {
        console.log('ClassPageCtrl:');
        console.log('ClassPageItems:getAll:before');
        ClassPageItems.getAll()
            .then(function (response) {
                console.log('ClassPageItems:getAll:then');
                $scope.course = angular.fromJson(response.course);
                $scope.available_games = angular.fromJson(response.games);
                $scope.available_word_lists = angular.fromJson(response.word_lists);
                $scope.available_posts = angular.fromJson(response.posts);
            });
    })
    .controller('PlayGameCtrl', function ($scope, $stateParams, ClassPageItems) {
        console.log('PlayGameCtrl:');
        console.log($stateParams);
        var agId = $stateParams.agId;
        console.log('ClassPageItems:getGameInfo:before');

        $scope.$on('$ionicView.loaded', function () {
            console.log('PlayGameCtrl: $ionicView.loaded');
            //ivanixcu todo: init msgframe, perhaps need better name than eventFrameInit
            //Lgz.eventFrameInit();
        });

        $scope.$on('$ionicView.enter', function () {
            console.log('PlayGameCtrl: $ionicView.entered');
            Lgz.eventFrameInit();

        });

        ClassPageItems.getGameInfo(agId)
            .then(function (response) {
                console.log('ClassPageItems:getGameInfo:then');
                $scope.ag = response;

            });
    })
    .controller('RecentCtrl', function ($scope, $http, RecentItems) {
        console.log('RecentCtrl:');
        RecentItems.getAll()
            .then(function (response) {
                $scope.feed_items = response;
            });
    })
    .controller('AccountCtrl', function ($scope, $http, StudentInfo) {
        StudentInfo.getStudentInfo(10052)
            .then(function (response) {
                $scope.student = angular.fromJson(response.student_data.student);
                $scope.registrations = angular.fromJson(response.student_data.registrations);
                console.log($scope.student.display_name);
            });
    });
