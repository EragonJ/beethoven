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
 *      XXX: It seems there is a small delay if you use timer to go through the interval (1s), 
 *      then you will get different results not in 1s interval !!
 *
 *
 */

var Beethoven = function( youtubeClip_id, youtubePlayer_id, LRCobjs ) {

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

    this.TIMER_INTERVAL = 100;

    // Properties 
    this.current = {
        'ss' : 0,
        'mm' : 0,
        'xx' : 0
    };

    this.performable = false;
    this.currentTimestamp = 0;

    this.LRCobjs = LRCobjs;

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

    getLRCtime : function( time , isMiliseconds) {

        if ( isMiliseconds === true ) {

            // make time in seconds
            time /= 1000; 
        }

        var newTime = {};
        
        newTime['mm'] = Math.floor( Math.floor( time ) / 60 );
        newTime['ss'] = Math.floor( time - newTime['mm'] * 60 );
        newTime['xx'] = Math.floor( ( time - newTime['mm'] * 60 - newTime['ss'] ) * 1000 );

        return newTime;
    },

    /*
     *  We have to set a outside timer to update the currentTimestamp because 
     *  Youtube's getCurrentTime() function is so weird that if you set an interval 
     *  in 1 second to get the duration of the movie each second, you will find 
     *  that the difference between each other is NOT 1 second. In this way, I 
     *  have to set a timer to get the most correct time in the smallest and the most 
     *  acceptable interval for the javascript timer.
     */
    setTimer : function() {

        var that = this;

        this.timer = window.setInterval(function() {

            that.setCurrentTimestamp();
            that.perform();

        }, this.TIMER_INTERVAL);
    },

    setCurrentTimestamp : function() {
        this.currentTimestamp = this.youtubePlayer.getCurrentTime() * 1000;
    },

    isPerformable : function() {

        return this.performable;
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
        this.setTimer();
    },

    onYoutubeStateChange : function( state_code ) {

        if ( this.STATE[ state_code ] === 'playing' ) {

            this.performable = true;
        }
        else if ( this.STATE[ state_code ] === 'paused' || this.STATE[ state_code ] === 'ended' ) {

            this.performable = false;
        }
    },

    /*
     *  This is how Beethoven performs the amazing songs ;)
     */
    perform : function() {

        if ( !this.isPerformable() ) return;

        for (var i = 0; i < this.LRCobjs.length; i++ ) {

            var o = this.LRCobjs[i];

            // Find the FIRST lyric that timestamp is bigger than the current one
            if ( this.currentTimestamp <= o['timestamp'] ) {
                console.log( o['lyric'] );
                break;
            }
        }
    }
};

// The API will call this function when the player is fully loaded and the API is ready to receive calls
function onYouTubePlayerReady( youtubePlayer_id ) {

    // this means window
    return this.beethoven_ref.onYouTubePlayerReady( youtubePlayer_id );
}

function onYoutubeStateChange( state_code ) {

    console.log( 'status code : '+ state_code );

    // this means window
    return this.beethoven_ref.onYoutubeStateChange( state_code );
}
