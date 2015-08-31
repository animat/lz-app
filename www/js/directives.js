angular.module('linguazone.directives', [])

.directive('lgzAudioPlayer', function($sce) {
  return {
    restrict: 'E',
    scope: {
      audioId: '='
    },
    templateUrl: 'templates/_audio-player.html',
    link: function(scope, element, attrs) {
      // TODO: Is this the best way to pass a trusted resource variable into a directive?
      scope.audioUrl = $sce.trustAsResourceUrl(K.baseUrl.audio + '/' + scope.audioId + '.mp3');
    }
  }
})

.directive('unique', function($q, $http, StudentInfo) {
  return {
    require: 'ngModel',
    link: function(scope, elem, attr, ctrl) {
      ctrl.$asyncValidators.unique = function(modelValue, viewValue) {
        var def = $q.defer();
        if (ctrl.$isEmpty(modelValue)) {
          def.reject();
        } else {
          StudentInfo.validateUniqueEmail(modelValue).then(function(response) {
            if (response.email_in_use) {
              def.reject();
            } else {
              def.resolve();
            }
          })
        }
        return def.promise;
      }
    }
  }
})

.directive('compareTo', function() {
  return {
    require: "ngModel",
    scope: {
        otherModelValue: "=compareTo"
    },
    link: function(scope, element, attributes, ngModel) {
      ngModel.$validators.compareTo = function(modelValue) {
        if (modelValue == undefined) return true;
        return modelValue == scope.otherModelValue;
      };
      scope.$watch("otherModelValue", function() {
        ngModel.$validate();
      });
    }
  };
})

.directive('focusAfterTransition', function($timeout) {
  return {
    link: function(scope, element, attrs) {
      $timeout(function() {
        element[0].focus();
      }, 750);
    }
  }
})