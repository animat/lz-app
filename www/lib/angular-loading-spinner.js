(function(){
  angular.module('ngLoadingSpinner', ['angularSpinner'])
  .directive('usSpinner',   ['$http', '$rootScope' ,function ($http, $rootScope){
    return {
      link: function (scope, elm, attrs) {
        $rootScope.spinnerActive = false;
        scope.isLoading = function () {
          return $http.pendingRequests.length > 0;
        };

        scope.$watch(scope.isLoading, function (loading)
          {
            $rootScope.spinnerActive = loading;
            if(loading){
              console.log($("#spinningOverlay"));
              // TODO: Add a transparent overlay while loading spinner is present
              elm.removeClass('ng-hide');
            }else{
              elm.addClass('ng-hide');
            }
        });
      }
    };

  }]);
}).call(this);
