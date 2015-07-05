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
      scope.audioUrl = $sce.trustAsResourceUrl('http://linguazone.s3.amazonaws.com/audio/'+scope.audioId+'.mp3');
    }
  }
})