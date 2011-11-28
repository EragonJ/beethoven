/*
 *  Beethoven - A music player which can control piano / guitar tabs when playing Youtube clips.
 * 
 *  Dependency :
 *      jQuery.js
 *      swfobject.js
 */

var Beethoven = function( youtubeClip_id, youtubePlayer_id ) {

    // properties 
    this.currentSeconds = 0;
    this.youtubePlayer  = null;
    this.youtubeClipURL = '';

    this.youtubeClip_id   = youtubeClip_id;
    this.youtubePlayer_id = youtubePlayer_id;


    this.setYoutubeClipURL();
    this.embedYoutubePlayer();
    this.setYoutubePlayer( youtubePlayer_id ) ;
};

// 
Beethoven.prototype = {

    /*
     *  This is a wrapper of swfobject.embedSWF, remember to pass necessary params shown below
     */
    embedYoutubePlayer : function() {
         
        swfobject.embedSWF( this.youtubeClipURL, this.youtubePlayer_id, "640", "385", "9.0.0", null, null, {
            allowScriptAccess: "always"
        }, {
            id : this.youtubePlayer_id
        });
    },
    
    // Get the youtubePlayer instance and set the desired events to that
    setYoutubePlayer : function( youtubePlayer_id ) {

        this.youtubePlayer = $('#' + youtubePlayer_id ).get(0);
        this.youtubePlayer.addEventListener('onStateChange', 'onYoutubeStateChange');
    },

    setYoutubeClipURL : function( ) {

        if ( this.isValidClip( this.youtubeClip_id ) ) {

            this.youtubeClipURL = 'http://www.youtube.com/v/' + this.youtubeClip_id +
                                  '?enablejsapi=1&version=3&playerapiid=' + this.youtubePlayer_id;
        }
        else {

            throw "Not a valid Youtube URL";
        }
    },

    isValidClip : function( id ) {

        return id.match(/^[a-zA-Z0-9\-]{11}$/);
    }

};

function onYoutubeStateChange( state_code ) {

    this.youtubePlayer = document.getElementById('ytapiplayer');
    console.log( this.youtubePlayer.getCurrentTime() );
}

// The API will call this function when the player is fully loaded and the API is ready to receive calls
function onYouTubePlayerReady( player_id ) {

    this.youtubePlayer = document.getElementById( player_id );
    this.youtubePlayer.addEventListener('onStateChange', 'onYoutubeStateChange');
}
