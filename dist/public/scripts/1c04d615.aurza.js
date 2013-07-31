$(document).ready(function () {
  var mediaPlayer = jQuery('#mediaContainer');
  mediaPlayer.jPlayer({
    swfPath: '/swf/Jplayer.swf',
    solution: 'flash, html',
    supplied: 'mp4, oga, wav',
    cssSelector: {
      play: '#playButton',
      pause: '#pauseButton',
      stop: '#stopButton'
    },
    ready: function () {
      jQuery(this).jPlayer('setMedia', {
        mp4: '/scripts/audio/aurza.mp4',
        wav: '/scripts//audio/aurza.wav'
      });
    }
  });
  $('#playButton').click(function () {
    $('#mediaContainer').jPlayer('play');
  });
  $('#pauseButton').click(function () {
    $('#mediaContainer').jPlayer('pause');
  });
  $('#stopButton').click(function () {
    $('#mediaContainer').jPlayer('stop');
  });
});