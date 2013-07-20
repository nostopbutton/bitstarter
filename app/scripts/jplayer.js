$(document).ready(function() {
  // Using jQuery object, rather than $
  var mediaPlayer = jQuery('#mediaContainer');

  mediaPlayer.jPlayer({
    // Tells JPlayer where to find the SWF file.
    swfPath: '/swf/Jplayer.swf',

    // Fix for some older Andriod phones.
    solution:    "flash, html",

    // Tells the player that the track is available in:
    //         mp3, Ogg Vorbis and Wave formats.
    supplied : 'mp4, oga, wav',

    // Assigns the CSS selectors which will control the player,
    //         creating buttons.
    cssSelector: {
      play: '#playButton',
      pause: '#pauseButton',
      stop: '#stopButton'
    },

    // Assigns the files for each format, once the player is loaded.
    ready: function() {jQuery(this).jPlayer("setMedia", {
      mp4: '/scripts/audio/aurza.mp4',
//          oga: '/audio/track.oga',
      wav: '/scripts//audio/aurza.wav'
    });}

  });
  $('#playButton').click(function() {
    $('#mediaContainer').jPlayer('play');
  });
  $('#pauseButton').click(function() {
    $('#mediaContainer').jPlayer('pause');
  });
  $('#stopButton').click(function() {
    $('#mediaContainer').jPlayer('stop');
  });
});