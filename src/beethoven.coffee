Beethoven = ( youtubeClip_id, youtubePlayer_id, LRCobjs ) ->

    ###
    We need to make a reference from window to beethoven
    TODO: Remind that this global variable is reserved by Beethoven
    ###
    window.beethoven_ref = @

    ###
    Constants
    ###
    @STATE = {
        '-1' : 'unstarted',
        '0'  : 'ended',
        '1'  : 'playing',
        '2'  : 'paused',
        '3'  : 'buffering',
        '5'  : 'cued'
    }

    @TIMER_INTERVAL = 100

    ### 
    Properties 
    ###
    @current = {
        'ss' : 0,
        'mm' : 0,
        'xx' : 0
    }

    @performable = false
    @currentTimestamp = 0

    @LRCobjs = LRCobjs

    @timer = null
    @youtubePlayer  = null
    @youtubeClipURL = ''

    @youtubeClip_id   = youtubeClip_id
    @youtubePlayer_id = youtubePlayer_id

    ###
    Actions
    ###
    @setYoutubeClipURL()
    @embedYoutubePlayer()

    return

Beethoven.prototype =

    embedYoutubePlayer : () ->

        swfobject.embedSWF(
            @youtubeClipURL,
            @youtubePlayer_id,
            "640",
            "385",
            "9.0.0",
            null,
            null,
            { allowScriptAccess: "always" },
            { id : @youtubePlayer_id }
        )

        return
    ,

    setYoutubeClipURL : () ->
        
        if @isValidClip( @youtubeClip_id )

            @youtubeClipURL = 'http://www.youtube.com/v/' + @youtubeClip_id +
                              '?enablejsapi=1&version=3&playerapiid=' + @youtubePlayer_id
        else

            throw "Not a valid Youtube URL"

        return
    ,

    getLRCtime : ( time , isMiliseconds ) ->


        time /= 1000 if isMiliseconds

        newTime = {
            mm : Math.floor( Math.floor( time ) / 60 ),
            ss : Math.floor( time - newTime['mm'] * 60 ),
            xx : Math.floor( ( time - newTime['mm'] * 60 - newTime['ss'] ) * 1000 )
        }

        return newTime
    ,

    setTimer : () ->

        @timer = window.setInterval(() =>

            @setCurrentTimestamp()
            @perform()

        , @TIMER_INTERVAL)

        return
    ,

    setCurrentTimestamp : () ->
    
        @currentTimestamp = @youtubePlayer.getCurrentTime() * 1000
        return
    ,

    isPerformable : () ->
        return @performable
    ,

    isValidClip : ( id ) ->
        return id.match(/^[a-zA-Z0-9\-]{11}$/)
    ,

    onYouTubePlayerReady : ( youtubePlayer_id ) ->

        @youtubePlayer = $('#'+ youtubePlayer_id ).get(0)
        @youtubePlayer.addEventListener('onStateChange', 'onYoutubeStateChange')
        @setTimer()

        return
    ,

    onYoutubeStateChange : ( state_code ) ->

        if @STATE[ state_code ] is 'playing'

            @performable = true
        
        else if @STATE[ state_code ] is 'paused' or @STATE[ state_code ] is 'ended'

            @performable = false
        
        return
    ,

    perform : () ->

        return false if not @isPerformable()

        ### 
            Remember to fix this into coffeescript
        ###
        `for ( i = 0; i < this.LRCobjs.length - 1; i++ ) {

            leftObj  = this.LRCobjs[i];
            rightObj = this.LRCobjs[i + 1];

            if ( this.currentTimestamp >= leftObj['timestamp'] &&
                 this.currentTimestamp < rightObj['timestamp'] ) {

                console.log( leftObj['lyric'] );
                break;

            }
        }`

        return
    ,

onYouTubePlayerReady = ( youtubePlayer_id ) ->

    return @beethoven_ref.onYouTubePlayerReady( youtubePlayer_id )

onYoutubeStateChange = ( state_code ) ->

    console.log( 'status code : ' + state_code )

    return this.beethoven_ref.onYoutubeStateChange( state_code )

