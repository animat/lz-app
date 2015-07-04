angular.module('linguazone.directives', [])

.directive('lgzAudioPlayer', function() {
  return {
    restrict: 'E',
    scope: {
      audioId: '='
    },
    templateUrl: 'templates/_audio-player.html'
  }
})