function MxbSpeech() {
     var audioStack = {};
    this.defaultLang = "eurfrenchfemale";
    this.callback = function(){};
    this.loadcall=function(data){};
    this.changecall=function(){};
    this.player = new Audio();
    this.preload = function(text,_args) {
        if (text ==="")
            throw "Invalid text input";
        var lang = this.defaultLang;
        if (typeof _args.lang!='undefined')
            lang=_args.lang;
        var args = _args;
        if (typeof args == 'undefined')
            args = {speed:0,pitch:100,loadcall:function(){},callback:function(){}};
        if (typeof args.speed == 'undefined')
            args.speed=0;
        if(typeof args.pitch == 'undefined')
            args.pitch=100;
        if (typeof args.changecall == 'undefined' || typeof args.changecall != 'function')
            args.changecall=this.changecall;
        if (typeof args.loadcall == 'undefined' || typeof args.loadcall != 'function')
            args.loadcall=this.loadcall;
        else
            this.player.removeEventListener("canplay",this.loadcall);
        if(typeof args.callback == 'undefined' || typeof args.callback != 'function')
            args.callback=this.callback;
        else
            this.player.removeEventListener("ended",this.callback);

        var uri = encodeURI("https://api.ispeech.org/api/rest?apikey=34b06ef0ba220c09a817fe7924575123&action=convert&voice="+lang+"&speed="+args.speed+"&pitch="+args.pitch+"&text="+text);
        var audio = new Audio(uri);
        audio.oncanplaythrough = function(evt) {
            audioStack[text] = audio;
            console.info("Loaded: "+text);
        };
        audio.load();
    };
    this.removeLoaded = function(key) {
        if(audioStack.hasOwnProperty(text))
            delete map[key];
        else
            console.log(key + " is not in the audioStack !");
    };
    this.clearLoaded = function(){
        audioStack = {};
    };
    this.setVolume = function(volume) {
        console.log(volume);
        this.player.volume=volume/100;
    };
    this.isPlaying = function() {
        return !this.player.paused;
    };
    this.setEventListener = function(_args) {
        var args = _args;
        if(typeof args.loadcall != 'undefined')
            this.loadcall = args.loadcall;
        if(typeof args.callback != 'undefined')
            this.callback = args.callback;
        if (typeof args.changecall == 'undefined' || typeof args.changecall != 'function')
            this.changecall=args.changecall;
    };
    this.speak = function(text,_args) {
        if (text ==="")
            throw "Invalid text input";
        var lang = this.defaultLang;
        if (typeof _args.lang!='undefined')
            lang=_args.lang;
        var args = _args;
        if (typeof args == 'undefined')
            args = {speed:0,pitch:100,loadcall:function(){},callback:function(){}};
        if (typeof args.speed == 'undefined')
            args.speed=0;
        if(typeof args.pitch == 'undefined')
            args.pitch=100;
        if (typeof args.changecall == 'undefined' || typeof args.changecall != 'function')
            args.changecall=this.changecall;
        if (typeof args.loadcall == 'undefined' || typeof args.loadcall != 'function')
            args.loadcall=this.loadcall;
        else
            this.player.removeEventListener("canplay",this.loadcall);
        if(typeof args.callback == 'undefined' || typeof args.callback != 'function')
            args.callback=this.callback;
        else
            this.player.removeEventListener("ended",this.callback);
        if(this.callback != args.callback ||  this.loadcall != args.loadcall || this.changecall != args.changecall) {
            this.callback = args.callback;
            this.loadcall = args.loadcall;
            this.changecall = args.changecall;
        }
        var uri = encodeURI("https://api.ispeech.org/api/rest?apikey=34b06ef0ba220c09a817fe7924575123&action=convert&voice="+lang+"&speed="+args.speed+"&pitch="+args.pitch+"&text="+text);
        if (this.player.src != uri)
            this.changecall();
        if(!audioStack.hasOwnProperty(text)){
             console.log(uri);
            console.log(Object.keys(audioStack).length);
            this.player.src=uri;
        } else {
            console.log(audioStack[text]);
            this.player = audioStack[text];
           this.loadcall({target:this.player}); //TRIGGER LOADCALL;
        }
        this.player.addEventListener("canplay",this.loadcall,false);
        this.player.addEventListener("ended", this.callback,false);
        this.player.play();
        return this.player.duration;
    };
    this.setDefault=function(_lang) {
        if(lang==="")
            throw "Invalid blank lang";
        this.defaultLang = _lang;
        var evt = new CustomEvent("SpeechStatChange",{code:4,message:"Changed Default Lang"});
        window.dispatchEvent(evt);
    };
    this.cancel = function() {
        this.pause();

        var evt = new CustomEvent("SpeechStatChange",{code:5,message:"Cancel speech"});
        window.dispatchEvent(evt);
    };
    this.resume = function() {
        this.player.play();
    };
    this.pause = function() {
        this.player.pause();
    };
}
