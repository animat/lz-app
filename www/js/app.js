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

angular.module('linguazone', ['ionic', 'linguazone.controllers', 'linguazone.services', 'linguazone.directives', 'ng-token-auth', 'ngLoadingSpinner'])

.run(function ($ionicPlatform) {
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

.factory('authInterceptor', function($window) {
  return {
    "request": function(config) {
      config.headers = config.headers || {};
      if ($window.localStorage["auth_headers"]) {
        config.headers.Authorization = angular.toJson($window.localStorage["auth_headers"]);
      }
      return config;
    },
    "response": function(response) {
      var newToken = response.data.token;
      if (newToken && $window.localStorage["auth_headers"]) {
        var authJson = angular.fromJson($window.localStorage["auth_headers"]);
        authJson.token = response.data.token;
        $window.localStorage["auth_headers"] = angular.toJson(authJson);
      }
      return response;
    }
  }
})

.config(function($httpProvider) {
  $httpProvider.defaults.withCredentials = true;
  $httpProvider.interceptors.push('authInterceptor');
})

.config(function($sceDelegateProvider, $compileProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    'self', 'http://www.linguazone.com/**', 'http://linguazone.s3.amazonaws.com/**'
  ]);
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

.config(function($authProvider) {
  $authProvider.configure({
    apiUrl:                 'http://localhost:3000/api/v2',
    tokenValidationPath:    '/auth/validate_token',
    signOutUrl:             '/auth/sign_out',
    emailRegistrationPath:  '/auth',
    passwordResetSuccessUrl:window.location.href,
    emailSignInPath:        '/auth/sign_in',
    storage:                'localStorage',
    authProviderPaths: {
      google:   '/auth/google'
    },
    tokenFormat: {
      "info":         "{{ info }}",
      "token":        "{{ accessToken }}",
      "uid":          "{{ uid }}",
      "provider":     "{{ provider }}",
      "expiry":       "{{ expiry }}"
    },
    parseExpiry: function(headers) {
      // convert from UTC ruby (seconds) to UTC js (milliseconds)
      return (parseInt(headers['expiry']) * 1000) || null;
    },
    handleLoginResponse: function(response, $auth) {
      $auth.persistData('auth_headers', {
        "token": response.data.token,
        "uid": response.data.uid,
        "provider": response.data.provider,
        "expiry": response.data.expiry
      });
      return response.data;
    },
    handleAccountResponse: function(response) {
      return response.data;
    },
    handleTokenValidationResponse: function(response) {
      return response.data;
    }
  })
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  
  // setup an abstract state for the app directive
  .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/app.html"
  })
  
  // Each tab has its own history stack:
    
  .state('app.classpage', {
    url: '/classpage',
    views: {
      'app-classpage': {
        templateUrl: 'templates/tab-classpage.html'
      }
    }
  })
  .state('app.play-game', {
    url: '/play-game/:agId',
    cache: false,
    views: {
      'app-classpage': {
        templateUrl: 'templates/play-game.html'
      }
    }
  })
  .state('app.review-word-list', {
    url: '/review-word-list/:awlId',
    cache: false,
    views: {
      'app-classpage': {
        templateUrl: 'templates/review-word-list.html'
      }
    }
  })
  .state('app.view-post', {
    url: '/view-post/:apId',
    cache: false,
    views: {
      'app-classpage': {
        templateUrl: 'templates/view-post.html'
      }
    }
  })

  .state('app.recent', {
    url: '/recent',
    views: {
      'app-recent': {
        templateUrl: 'templates/tab-recent.html'
      }
    }
  })

  .state('app.account', {
    url: '/account',
    views: {
      'app-account': {
        templateUrl: 'templates/tab-account.html'
      }
    }
  })
  
  .state('app.new-user', {
    url: '/new-user',
    views: {
      'app-account': {
        templateUrl: 'templates/new-user.html'
      }
    }
  })

  .state('app.new-registration', {
    url: '/new-registration',
    cache: true,
    views: {
      'app-account': {
        templateUrl: 'templates/new-registration.html'
      }
    }
  })

  .state('app.state-show', {
    url: '/states/:stateId', 
    views: {
      'app-account': {
        templateUrl: 'templates/state-show.html'
      }
    }
  })

  .state('app.school-show', {
    url: '/schools/:schoolId',
    views: {
      'app-account': {
        templateUrl: 'templates/school-show.html'
      }
    }
  })

  .state('app.login', {
    url: '/login',
    views: {
      'app-account': {
        templateUrl: 'templates/login.html'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/classpage');
});
