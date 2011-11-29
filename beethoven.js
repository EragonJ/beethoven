/*
 *  Beethoven - A music player which can control piano / guitar tabs when playing Youtube clips.
 * 
 *  Dependency :
 *      jQuery.js
 *      swfobject.js
 *
 *  Working Flow :
 *      
 *      ----------                                                 
 *      | window |--- beethoven_ref ----> o
 *      |---------
 *
 *      P.S. o is a beethoven instance, and window.beethoven_ref will be set up when o is initialized.
 *
 *      o <----------------------------------------------------------
 *      |                                                           |
 *      | If the clip is loaded                                     |
 *      |                                                           |
 *      v                                                           |                       
 *     call onYouTubePlayerReady()                                  |
 *      |                                                           |
 *      |-- Set youtubePlayer property back through beethoven_ref ---
 *
 *          this.beethoven_ref.youtubePlayer = $('#'+ youtubePlayer_id ).get(0);
 *                                                                 
 *
 */

var Beethoven = function( youtubeClip_id, youtubePlayer_id ) {

    // We need to make a reference from window to beethoven
    // TODO: Remind that this global variable is reserved by Beethoven
    window.beethoven_ref = this;

    // Properties 
    this.currentSeconds = 0;
    this.youtubePlayer  = null;
    this.youtubeClipURL = '';

    this.youtubeClip_id   = youtubeClip_id;
    this.youtubePlayer_id = youtubePlayer_id;

    // Actions
    this.setYoutubeClipURL();
    this.embedYoutubePlayer();
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

// The API will call this function when the player is fully loaded and the API is ready to receive calls
function onYouTubePlayerReady( youtubePlayer_id ) {

    // this means window
    this.beethoven_ref.youtubePlayer = $('#'+ youtubePlayer_id ).get(0);
    this.beethoven_ref.youtubePlayer.addEventListener('onStateChange', 'onYoutubeStateChange');
}

function onYoutubeStateChange( state_code ) {

    // this means window
    console.log( this.beethoven_ref.youtubePlayer.getCurrentTime() );
}
