function MxbSpeech() {
    this.defaultLang = "Manon";
    this.player = new Audio();
    this.speak = function(text,_lang) {
        if (text ==="")
            throw new Exception("Invalid text input");
        var lang = this.defaultLang;
        if (typeof _lang!='undefined')
            lang=_lang;
        var http = new XMLHttpRequest();
        var url = "https://www.acapela-group.com/demo-tts/DemoHTML5Form_V2_fr.php?langdemo=V";
        var params = "MyLanguages=sonid15&0=Leila&1=Laia&2=Eliska&3=Mette&4=Zoe&5=Jasmijn&6=Tyler&7=Deepa&8=Rhona&9=Rachel&10=Sharon&11=Hanna&12=Sanna&13=Justine&14=Louise&MySelectedVoice="+lang+"&16=Claudia&17=Dimitris&18=Fabiana&19=Sakura&20=Minji&21=Lulu&22=Bente&23=Monika&24=Marcia&25=Celia&26=Alyona&27=Biera&28=Ines&29=Rodrigo&30=Elin&31=Samuel&32=Kal&33=Mia&34=Ipek&MyTextForTTS="+text+"&t=1&SendToVaaS=";
        http.open("POST", url, true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.onreadystatechange = function() {
            if(http.readyState == 4 && http.status == 200) {
                var evt = new CustomEvent("SpeechStatChange",{code:200,message:"Voice Requested"});
                window.dispatchEvent(evt);
                var response = http.responseText;
                var uri = response.substring(str.lastIndexOf("'",response.indexOf("myPhpVar"))+1,str.lastIndexOf("'"));
                console.log(uri);
                if(uri == -1)
                    throw new Exception("Could not get the uri on the server, check your args!");
                this.player.src = uri;
                this.player.onended = function() {
                    var evt = new CustomEvent("SpeechFinish");
                    window.dispatchEvent(evt);
                };
                this.player.play();
            } else {
                throw new Exception("Check your connection, couldn't contact th server");
            }
        };
        http.send(params);
    };
    this.setDefault=function(_lang) {
        if(lang=="")
            throw new Exception("Invalid blank lang");
        this.defaultLang = _lang;
        var evt = new CustomEvent("SpeechStatChange",{code:4,message:"Changed Default Lang"});
        window.dispatchEvent(evt);
    };
    this.cancel = function() {
        this.player.pause();
        this.player.src="";
        var evt = new CustomEvent("SpeechStatChange",{code:4,message:"Cancel speech"});
        window.dispatchEvent(evt);
    };
    this.resume = function() {
        this.player.play();
    };
    this.pause = function() {
        this.player.pause();
    };
}
