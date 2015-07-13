/*global
    $: true,
    require: true,
    process: true,
    angular: true,
    console: true,
    cordova: true,
    screen: true,
    K: true,
    StatusBar: true,
    window: true
 */
/*jslint  nomen: true, sloppy: true */
/*
    .constant('API', {
        url: 'http://lgz.ivanix.com/api/v2/'
    })

        api: 'http://lgz.ivanix.com/api/v2/',
        gamedir: 'http://lgz.ivanix.com/games/'

    */
angular.module('linguazone', ['ionic', 'linguazone.controllers', 'linguazone.services'])
    .run(function ($ionicPlatform) {
        window.g = window.g || {};
        window.g.ip = $ionicPlatform;
        $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
            //ivanixcu: set app to portrait mode
            screen.lockOrientation('portrait');
        });
    })
    .config(function ($stateProvider, $urlRouterProvider) {
        console.log('config: stateprovider, urlRouterProvider');

	  // Ionic uses AngularUI Router which uses the concept of states
	  // Learn more here: https://github.com/angular-ui/ui-router
	  // Set up the various states which the app can be in.
	  // Each state's controller can be found in controllers.js
      
	  // setup an abstract state for the app directive
	    $stateProvider
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/app.html"
            })

  // Each tab has its own nav history stack:

            .state('app.classpage', {
                url: '/classpage',
                cache: false,
                views: {
                    'app-classpage': {
                        templateUrl: 'templates/tab-classpage.html',
                        controller: 'ClassPageCtrl'
                    }
                }
            })
            .state('app.play-game', {
                url: '/classpage/:agId',
                cache: false,
                views: {
                    'app-classpage': {
                        templateUrl: 'templates/play-game.html',
                        controller: 'PlayGameCtrl'
                    }
                }
            })
            .state('app.recent', {
                url: '/recent',
                cache: false,
                views: {
                    'app-recent': {
                        templateUrl: 'templates/tab-recent.html',
                        controller: 'RecentCtrl'
                    }
                }
            })
            .state('app.account', {
                url: '/account',
                cache: false,
                views: {
                    'app-account': {
                        templateUrl: 'templates/tab-account.html',
                        controller: 'AccountCtrl'
                    }
                }
            });

            // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/classpage');

        

    });
