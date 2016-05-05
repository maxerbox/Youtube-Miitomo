// ==UserScript==
// @name         Youtube Miitomo
// @namespace    com.maxerbox.youtube.miitomo
// @version      1 B18
// @description  Du fun ;)
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

InstallElements();
function MxbPanel() {

    this.id = "mxb-panel";
    this.titleID="mxb-panel-title";
    this.open = function(title) {
        var background = document.createElement('div');
        $(background).css({"z-index": "1010",
                           "background-color": "#167ac6",
                           "position": "fixed",
                           "width": "auto",
                           "height": "auto",
                           "color":"#fff",
                           "bottom":"1px",
                           "padding":"0px",
                           "font-size": "30px"
                          });
        $(background).attr("id",this.id);
        var text = document.createElement('p');
        $(text).attr("id",this.titleID);
        $(text).text(title);
        $(background).append(text);
        $("body").append(background);
        this.openAnimation();
    };
    this.warning = function() {
        $("#"+this.titleID).css({"color":"red"});
        setTimeout(function(){
            $("#"+this.titleID).css({"color":"#FFF"});
        },1000);
    };
    this.set=function(text,warning) {
        $("#"+this.titleID).text(text);
        if(warning!==false) {
            this.warning();
        }
    };
    this.addElement=function(elem){
        $("#"+this.id).append(elem);
    };
    this.close = function() {
        $("#"+this.id).remove();
    };
    this.openAnimation = function() {
        var sequence = 0;
        var idDiv = this.id;
        console.log("Open");
        for(var i = 0;i<10;i++) {
            sequence += 600;
            setTimeout(function(){
                $("#"+idDiv).css({"padding":i+"px"});},sequence);
        }};
}
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
var musicGroup=null;
var speecher = null;
var loader = null;
function Loader(){
    this.id = "LoaderMxb";
    this.percID="pourcentageMXB";
    this.titleID="titleMXB";
    if(!window.jQuery)
        throw "Missing JQUERY";
    this.Show = function(title) {

        var background = document.createElement('div');
        $(background).css({"z-index": "1010",
                           "background-color": "rgb(255, 255, 255)",
                           "position": "fixed",
                           "width": "100%",
                           "height": "100%",
                           "top": "0",
                           "left": "0"});
        $(background).attr("id",this.id);
        var center = document.createElement('div');
        $(center).css({"height": "100%",
                       "margin": "0 auto",
                       "padding": "10px",
                       "position": "relative",
                       "width": "640px",
                       "text-align":"center"});
        var img = document.createElement('img');
        $(img).attr("src","https://googledrive.com/host/0B__eiELCHBcaajVHZUN1Wmptems/wait.gif");
        $(img).css("margin-top","30%");
        $(center).append(img);
        var percentage = document.createElement('div');
        $(percentage).attr("id",this.percID);
        $(center).append(percentage);
        var text = document.createElement('p');
        $(text).attr("id",this.titleID);
        $(text).text(title);
        $(center).append(text);
        $(background).append(center);
        $(document.body).append(background);
    };
    this.IsOn = function() {
        if($("#"+this.id).length)
            return true;
        else
            return false;
    };
    this.Close = function() {
        if(this.IsOn())
            $("#"+this.id).remove();
    };
    this.Set = function(title,value) {
        if(!this.IsOn())
            throw "Closed, impossible to set !";
        $("#"+this.percID).text(value+"%");
        $("#"+this.titleID).text(title);

    };
}
function InstallElements() {
    console.log("InstallElements");
    //SCRIPTS
    var scripts = [{src:"https://cdnjs.cloudflare.com/ajax/libs/buzz/1.1.10/buzz.min.js",id:"buzz-music-library"}];
    scripts.forEach(function(item,index) {
        var scrpt = document.createElement('script');
        scrpt.type = "text/javascript";
        scrpt.src = item.src;
        scrpt.id=item.id;
        document.getElementsByTagName('head')[0].appendChild(scrpt);
    });
    //JQUERY
    if(!window.jQuery)
    {
        console.log("Installation de JQUERY");
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.src = "https://code.jquery.com/jquery-1.12.3.min.js";
        script.onload= function(e) {
            Initialize();
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {
        document.onload = function(e){
            Initialize();
        };
    }
    //CSS
    /*
   var CSS = ["//easy-peasy.esy.es/dist/remodal.css","//easy-peasy.esy.es/dist/remodal-default-theme.css"];
    CSS.forEach(function(item,index) {
        var link = document.createElement('link');
        link.rel="stylesheet";
        link.href=item;
        document.getElementsByTagName('head')[0].appendChild(script);
    }); */
}
var CommentProcess;
var VideoProcess;
var textColor;
var panel;
function Initialize() {
    console.log("Initialize");
    clearInterval(CommentProcess);
    clearInterval(VideoProcess); // Clear intervale if it's already set
    panel = new MxbPanel();
    panel.open("Youtube Miitomo V1 b18 by Maxerbox");
    loader = new Loader();
    textColor = new TextEngine();
    speecher = new MxbSpeech();
    window.addEventListener('NewVideo',function(element){
        console.log("New Video");
        window.scrollTo(0,document.body.scrollHeight);
        var title = $(element).find("#eow-title").text();
        var r =  window.confirm("Vdéo trouvée: \n"+title+"Démarrer l'engine ?!");
        if (r === true)
            EngineStart();

    });
    // VideoCheck();
    VideoProcess = setInterval(VideoCheck,2000);

}
function readCookie(name) {
    name += '=';
    for (var ca = document.cookie.split(/;\s*/), i = ca.length - 1; i >= 0; i--)
        if (!ca[i].indexOf(name))
            return ca[i].replace(name, '');
}
function EngineStart() {
    musicGroup = new buzz.group([new buzz.sound("https://www.youtubeinmp3.com/fetch/?video=http://www.youtube.com/watch?v=KtC-rGTnw3U"),new buzz.sound("https://www.youtubeinmp3.com/fetch/?video=http://www.youtube.com/watch?v=rAzRQ_2j9z8"),new buzz.sound("https://www.youtubeinmp3.com/fetch/?video=http://www.youtube.com/watch?v=Dowjr0YTbqw"),new buzz.sound("https://www.youtubeinmp3.com/fetch/?video=http://www.youtube.com/watch?v=ObUNM0uZ_Tc"),new buzz.sound("https://www.youtubeinmp3.com/fetch/?video=http://www.youtube.com/watch?v=Ol4pN45QvFg"),new buzz.sound("https://www.youtubeinmp3.com/fetch/?video=http://www.youtube.com/watch?v=Ol4pN45QvFg"),new buzz.sound("https://www.youtubeinmp3.com/fetch/?video=http://www.youtube.com/watch?v=1A8AWQKyVyg"),new buzz.sound("https://www.youtubeinmp3.com/fetch/?video=http://www.youtube.com/watch?v=YAbtHwBwuSI")]);
    musicGroup.bind("canplay",function(event){
        musicGroup.setVolume($("#mxb-sound-music").attr("value"));
    });
    //  musicGroup.play().fadeIn();

    window.addEventListener('NewComments',function(event){
        console.log(event.detail);
        if(loader.IsOn())
            window.setTimeout(function(){loader.Close();},1000);
        $(event.detail.objects).each(function(index,obj){
            SetComment(obj);});
        loader.Set("Finalisation....",100);
        window.setTimeout(function(){
            loader.Close();
          
                                    },1000);
    });
    loader.Show("Démarrage....");
    CommentProcess = setInterval(CommentCheck,1000);
    //   load.Set("Chargement des musiques.....",1);
    //Style
    loader.Set("Application du style....",50);
    $("#body-container").css("background-image","url(https://googledrive.com/host/0B__eiELCHBcaajVHZUN1Wmptems/mii-sprites.png)");
    if(!$("#mxb-sound-speech").length) {
        console.log("Append");
        //Voix
        var input1 = document.createElement('input');
        $(input1).attr({type:"range",value:50,min:0,max:100,step:10,id:"mxb-sound-speech"});
        if (document.cookie.indexOf("mxb-sound-speech") >= 0) {
            var speechVolume = readCookie("mxb-sound-speech");
            $(input1).attr("value",speechVolume);
        }
        input1.onchange=function(event){
            speecher.setVolume(event.target.value);
            document.cookie="mxb-sound-speech="+event.target.value;
        };
        $(input1).css({"margin-right":"15px",height:"8px"});
        $("#yt-masthead-user").prepend(input1);
        //texte voix
        var text1 = document.createElement('a');
        $(text1).text("Voix:");
        $("#yt-masthead-user").prepend(text1);
        //Musique
        var input2 = document.createElement('input');
        $(input2).attr({type:"range",min:0,max:100,value:50,step:10,id:"mxb-sound-music"});
        if (document.cookie.indexOf("mxb-sound-music") >= 0) {
            var musicVolume = readCookie("mxb-sound-music");
            $(input2).attr("value",musicVolume);
        }

        input2.onchange=function(event){
            musicGroup.setVolume(event.target.value);
            document.cookie="mxb-sound-music="+event.target.value;
        };
        //WithoutMusic
        $(input2).hide();

        $(input2).css({"margin-right":"15px",height:"8px"});
        $("#yt-masthead-user").prepend(input2);
        //Texte musique
        var text2 = document.createElement('a');
        $(text2).text("Musique:");

        //WithoutMusic
        $(text2).hide();

        $("#yt-masthead-user").prepend(text2);

    }

    setTimeout(loader.Set("En attente de commentaire..... (Si ce processus prend trop de temps, vérifiez votre connection et si la vidéo contient des commentaires, sinon, rechargez la page)",99),1000);
    console.log("Engine started");
}

function SetComment(elem){
    var min = 2;
    var max = 6;
    speecher.setVolume($("#mxb-sound-speech").attr("value"));
    console.log("SetElement");
    var randomSex = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
    var random = Math.floor(Math.random() * (max - min + 1)) + min;
    var randomData = {speed: null,pitch:10,lang:null};
    if(randomSex === 1){
        randomData.lang="eurfrenchmale";
        if(random==5)
            randomData.speed = 1;
        else {
            if(random < 5 )
                randomData.speed=Math.floor((-(random)));
            else
                randomData.speed=Math.floor((random));
        }
    }
    else {
        randomData.lang= "eurfrenchfemale";
        if(random==5)
            randomData.speed = 0;
        else {
            if(random < 5)
                randomData.speed=Math.floor((-(random)));
            else
                randomData.speed=Math.floor((random)); }
    }
    //Mii
    var randomImage = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    var urlImage ="https://googledrive.com/host/0B__eiELCHBcac1N2NmxxSGtvM0k/Random1.jpg";
    if(randomData.lang=="eurfrenchfemale")
        urlImage = "https://googledrive.com/host/0B__eiELCHBcac1N2NmxxSGtvM0k/Random"+randomImage+".jpg";
    else
        urlImage = "https://googledrive.com/host/0B__eiELCHBcaMFltWGdLeF94MHc/Random"+randomImage+".jpg";
    $(elem).find(".yt-thumb-clip").find("img").attr("src",urlImage);
    //EventHandler
    randomData.loadcall= function(event) {

        //     $(elem).find(".yt-thumb-clip").find("img").attr("src",urlImage);
        console.log("Color");
        textColor.ColorText($(elem).find(".comment-renderer-text-content"),Math.floor((event.target.duration*1000)/$(elem).find(".comment-renderer-text-content").text().length));
    };
    randomData.callback=function(){
        console.log("Finish");
        textColor.Cancel();
        textColor.ClearTextSimple($(elem).find(".comment-renderer-text-content"));
    };
    randomData.changecall= function(){
        //     $(elem).find(".yt-thumb-clip").find("img").attr("src",urlImage);
        console.log("Src changed");
        textColor.Cancel();
        textColor.ClearTextSimple($(elem).find(".comment-renderer-text-content"));
    };
    /*$(elem).on("mouseleave",function(data){
        console.log("mouseleave");
        speecher.cancel();
     //  textColor.Cancel();
       // textColor.ClearTextSimple($(elem).find(".comment-renderer-text-content"));
    }); */
    //MouseEnter
    /*    $(elem).hover(function(data){
        //  setTimeout(function(){$(elem).find(".yt-thumb-clip").find("img").attr("src","https://www.drupal.org/files/Loading.gif");},300); //setTimeout because youtube redefine the img;
        console.log(data.target);
        speecher.speak($(elem).find(".comment-renderer-text-content").text(),randomData);
        console.log("mouseenter");
    },function(){
        //    $(elem).find(".yt-thumb-clip").find("img").attr("src",urlImage);
        console.log("mouseleave");
        speecher.cancel();
        textColor.Cancel();
        textColor.ClearTextSimple($(elem).find(".comment-renderer-text-content"));
    }); */
    //PRELOAD ENGINE TEST
    speecher.preload($(elem).find(".comment-renderer-text-content").text(),randomData);
    //END TEST
    $(elem).bind("mouseenter",function(data){
        //  setTimeout(function(){$(elem).find(".yt-thumb-clip").find("img").attr("src","https://www.drupal.org/files/Loading.gif");},300); //setTimeout because youtube redefine the img;
        console.log(data.target);
        speecher.speak($(elem).find(".comment-renderer-text-content").text(),randomData);
        console.log("mouseenter");
    });
    $(elem).bind("mouseleave",function(){
        //    $(elem).find(".yt-thumb-clip").find("img").attr("src",urlImage);
        console.log("mouseleave");
        speecher.cancel();
        textColor.Cancel();
        textColor.ClearTextSimple($(elem).find(".comment-renderer-text-content"));
    });
}
function TextEngine() {
    var process = [];
    this.Cancel = function() {
        process.forEach(function(item,index){
            clearTimeout(item);
        });
    };
    this.ClearTextSimple = function(elem) {
        if(!this.IsSet(elem)) {
            var text= $(elem).text();
            $(elem).text("");
            for (var i=0;i<text.length;i++) {
                var span = document.createElement('span');
                $(span).text(text[i]);
                $(elem).append(span);
            }
        }
        $(elem).find("span").each(function(index,obj) {
            $(obj).css("color","black");
        });
    };
    this.ClearText = function(elem,time,_color) {
        console.log("ClearText");
        var color = "blue";
        if (typeof _color !='undefined')
            color = _color;
        if(!this.IsSet(elem)) {
            var text= $(elem).text();
            $(elem).text("");
            for (var i=0;i<text.length;i++) {
                var span = document.createElement('span');
                $(span).text(text[i]);
                $(elem).append(span);
            }
        }
        var sequence = 0;
        $($(elem).find("span").get().reverse()).each(function(index,obj) {
            sequence += time;
            setTimeout(function(){
                $(obj).css("color",color);
            },sequence);
        });
    };
    this.IsSet = function(elem) {
        if($(elem).find("span").length > 0)
            return true;
        else
            return false;
    };
    this.ColorText = function (elem,time,_color) {
        var color = "blue";
        if (typeof _color !='undefined')
            color = _color;
        var text= $(elem).text();
        $(elem).text("");
        for (var i=0;i<text.length;i++) {
            var span = document.createElement('span');
            $(span).text(text[i]);
            $(elem).append(span);
        }
        var sequence = 0;
        $(elem).find("span").each(function(index,obj){
            sequence += time;
            process.push(setTimeout(function(){
                $(obj).css("color",color);
            },sequence));
        });
        /*  for (var s=0;s<spans.length;s++) {
        sequence += time;
       setTimeout(function(){
        $(spans[s]).text("s");
        },sequence);
    }*/
    };
}
function VideoCheck(getMode){
    console.log("Checking for video...");
    var video = $("#watch7-content");

    if(video.length && video.attr("data-checked") != "true" ){

        if(getMode ===true)
            return video;
        var evt = new CustomEvent("NewVideo",video);
        window.dispatchEvent(evt);
        console.log("Dispatch");
        video.attr("data-checked","true");
    }
}
function CommentCheck(getMode) {
    var resultat = [];
    var comments = $(".comment-renderer");

    if (comments.length) {
        comments.filter(function(index,element)
                        {
            if($(element).attr("data-checked") != "true")
                return true;
        }).each(function(index,obj){
            $(obj).attr("data-checked","true");
            resultat.push(obj);
        }
               );
        if(getMode===true)
            return video;

        if(resultat.length > 0) {
            var event = new CustomEvent("NewComments",{detail:{objects:resultat}});
            window.dispatchEvent(event);
        }
   
