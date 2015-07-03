angular.module('linguazone', ['ionic', 'linguazone.controllers', 'linguazone.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the app directive
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
    url: '/play-game/:agId',
    views: {
      'app-classpage': {
        templateUrl: 'templates/play-game.html',
        controller: 'PlayGameCtrl'
      }
    }
  })
  .state('app.review-word-list', {
    url: '/review-word-list/:awlId',
    views: {
      'app-classpage': {
        templateUrl: 'templates/review-word-list.html',
        controller: 'ReviewWordListCtrl'
      }
    }
  })
  .state('app.view-post', {
    url: '/view-post/:apId',
    views: {
      'app-classpage': {
        templateUrl: 'templates/view-post.html',
        controller: 'ViewPostCtrl'
      }
    }
  })
  
  .state('app.recent', {
    url: '/recent',
    views: {
      'app-recent': {
        templateUrl: 'templates/tab-recent.html',
        controller: 'RecentCtrl'
      }
    }
  })
  
  .state('app.account', {
    url: '/account',
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
