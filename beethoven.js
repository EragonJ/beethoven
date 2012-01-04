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
 *  ATTENTION:
 *      
 *      To test any of these calls, you must have your file running on a webserver,
 *      as the Flash player restricts calls between local files and the internet.
 *
 *
 */

var Beethoven = function( youtubeClip_id, youtubePlayer_id ) {

    // We need to make a reference from window to beethoven
    // TODO: Remind that this global variable is reserved by Beethoven
    window.beethoven_ref = this;

    // Constants
    this.STATE = {
        '-1' : 'unstarted',
        '0'  : 'ended',
        '1'  : 'playing',
        '2'  : 'paused',
        '3'  : 'buffering',
        '5'  : 'cued'
    };

    this.TIMER_INTERVAL = 200;

    // Properties 
    this.current = {
        'ss' : 0,
        'mm' : 0,
        'xx' : 0
    };

    this.timer = null;
    
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
    embedYoutubePlayer : function( ) {
         
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

    increaseDuration : function() {

        // in miliseconds
        var oldTime = ( ( this.current['mm'] * 60 ) + this.current['ss'] ) * 1000 + this.current['xx'];

        oldTime += this.TIMER_INTERVAL;

        this.current = this.getProcessedTime( oldTime , true);
    },

    /*
     *  We have to reset timer when the player is PLAYING. In this way, we can get the correct duration
     *  of this video.
     */
    resetDuration : function() {

        var oldTime = this.youtubePlayer.getCurrentTime();
        this.current = this.getProcessedTime( oldTime );

        console.log( this.current );
    },

    getProcessedTime : function( time , isMiliseconds) {

        if ( isMiliseconds === true) {

            // make time in seconds
            time /= 1000; 
        }

        var newTime = {};
        
        newTime['mm'] = Math.floor( Math.floor( time ) / 60 );
        newTime['ss'] = Math.floor( time - newTime['mm'] * 60 );
        newTime['xx'] = Math.floor( ( time - newTime['mm'] * 60 - newTime['ss'] ) * 1000 );

        return newTime;
    },

    startTimer : function() {

        var that = this;

        this.timer = window.setInterval(function() {

            that.increaseDuration();

        }, this.TIMER_INTERVAL);
    },

    stopTimer : function() {

        clearInterval( this.timer );
    },

    isValidClip : function( id ) {

        return id.match(/^[a-zA-Z0-9\-]{11}$/);
    },

    /*
     *  I extract the onYoutube* events into beethoven so that I can easily manipulate the properties
     */
    onYouTubePlayerReady : function( youtubePlayer_id ) {

        this.youtubePlayer = $('#'+ youtubePlayer_id ).get(0);
        this.youtubePlayer.addEventListener('onStateChange', 'onYoutubeStateChange');

    },

    onYoutubeStateChange : function( state_code ) {

        if ( this.STATE[ state_code ] === 'playing' ) {
            
            this.resetDuration();
            this.startTimer();
        }
        else if ( this.STATE[ state_code ] === 'paused' || this.STATE[ state_code ] === 'ended' ) {

            console.log( this.current );
            this.stopTimer();
        }
    }

};

// The API will call this function when the player is fully loaded and the API is ready to receive calls
function onYouTubePlayerReady( youtubePlayer_id ) {

    // this means window
    return this.beethoven_ref.onYouTubePlayerReady( youtubePlayer_id );
}

function onYoutubeStateChange( state_code ) {

    console.log( state_code );

    // this means window
    return this.beethoven_ref.onYoutubeStateChange( state_code );
}
