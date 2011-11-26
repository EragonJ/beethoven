// 
//  Dependency :
//      jQuery.js
//      swfobject.js
//

var Beethoven = function( youtubePlayer_id ) {

    // properties 
    this.youtubePlayer = null;
    this.currentSeconds = 0;

    this.setYoutubePlayer( youtubePlayer_id ) ;
};

// 
Beethoven.prototype = {
    
    // Get the youtubePlayer instance and set the desired events to that
    setYoutubePlayer : function( youtubePlayer_id ) {
        this.youtubePlayer = document.getElementById( youtubePlayer_id );
        this.youtubePlayer.addEventListener('onStateChange', onYoutubeStateChange);
    },

};

function onYoutubeStateChange( state_code ) {

}

// The API will call this function when the player is fully loaded and the API is ready to receive calls
function onYouTubePlayerReady( player_id ) {
     
}
