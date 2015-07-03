/*global
    $: true,
    Phaser: true,
    K: true, console: true,
    location: true,
    parent: true,
    window: true,
    LgzLib: true
 */
/*jslint  nomen: true */

var g  = g || {};
var LgzLib = LgzLib || {};
LgzLib.MsgFrameConstants = function () {
    'use strict';
    return {
        FrameIsParent: 1,
        FrameIsLoader: 2,
        FrameIsGame: 3,
        FrameIsNative: 4,
        
        OrientIsLandScape: 11,
        OrientIsPortrait: 12,
        OrientIsAny: 13,
        
        ViewIsFullScreen: 21,
        ViewIsNormal: 22,
        
        GameParmsGet: 31,
        GameParmsReply: 32
       
    };
};
LgzLib.MsgFrame = function () {
    'use strict';
    this.init();
};
LgzLib.MsgFrame.prototype.switchEvent = function () {
    'use strict';
};
LgzLib.MsgFrame.prototype.initFrame = function () {
    'use strict';
};
LgzLib.MsgFrame.prototype.init = function () {
    'use strict';
    var thisObj, prop;
    thisObj = this;
    
    this.CK = LgzLib.MsgFrameConstants();

    //
    // note: set default baseUrl {api,games, etc} as defined in kconf.js
    //
    this.baseUrl  = {};
    for (prop in K.baseUrl) {
        if (K.baseUrl.hasOwnProperty(prop)) {
	        this.baseUrl[prop] = K.baseUrl[prop];
        }
    }


    $(window).on('message', function (e) {
        thisObj.eventSwitch(e.originalEvent.data);
    });
    thisObj.initFrame();
};
LgzLib.MsgFrame.prototype.urlInfo = function (gameid) {
    'use strict';
    //orig: href = K.urlSvrXML + 'info.xml?id=' + gameid;
    return this.baseUrl.api + '/games/ginfo/' + gameid;
};
LgzLib.MsgFrame.prototype.getJsonFromUrl = function () {
    'use strict';
    var query, result;
    query = location.search.substr(1);
    result = {};
    query.split("&").forEach(function (part) {
        var item = part.split("=");
        result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
};
LgzLib.MsgFrame.prototype.sendToParent = function (event, value) {
    'use strict';
    console.log('(embedded)LgzLib.MsgFrame.sendToParent');
    //parent.postMessage({'event': event, 'value': value}, location.origin);
    parent.postMessage({'event': event, 'value': value}, '*');
};
LgzLib.MsgFrame.prototype.sendToChild = function (event, value) {
    'use strict';
    console.log('(embedded)LgzLib.MsgFrame.sendToChild');
    //this.childWin.postMessage({'event': event, 'value': value}, location.origin);
    this.childWin.postMessage({'event': event, 'value': value}, '*');
};
//_______________________________________________________________

LgzLib.MsgFrames = {};

LgzLib.MsgFrames.Parent  = function () {
    'use strict';
    LgzLib.MsgFrame.call(this);
};
LgzLib.MsgFrames.Parent.lgzExtends(LgzLib.MsgFrame);

LgzLib.MsgFrames.Parent.prototype.gameParms = function () {
    'use strict';
    var id, parm, parms, gameid, baseUrl;

    parms = this.getJsonFromUrl();

    if (parms.gameid) {
        this.$lgzFrame.attr('gameid', parms.gameid);
    }
    if (parms.userid) {
        this.$lgzFrame.attr('userid', parms.userid);
    }

    parms.userid = this.$lgzFrame.attr('userid');
    
    parms.gameid = this.$lgzFrame.attr('gameid');

    baseUrl = JSON.parse(JSON.stringify(this.baseUrl));


/*
 * note: not used.  first try at passing parms between 
 * ionic/angular to msgframe.parent which then passes on to child loader and child game
 * tbd: if api returns updated baseUrls, ionic will pass as arguments to 
 * Lgz.eventFrameInit() in js/controllers.js
 *
    parm = this.$lgzFrame.attr('gamedir');
    if (parm && parm.length) {
        baseUrl.games = parm;
    }

    parm = this.$lgzFrame.attr('api');
    if (parm && parm.length) {
        baseUrl.api = parm;
    }
*/

    baseUrl.lang = this.baseUrl.lang;

    parms.baseUrl = baseUrl;

    //ivanixcu: note swf is for dev/demo prototyping
    // normally gameSWF is provided by info.xml
    //
    parms.gameSWF = this.$lgzFrame.attr('gameswf');
    
    return parms;

};
LgzLib.MsgFrames.Parent.prototype.viewFullScreen = function () {
    'use strict';
    var $f, w, h, ratio;
    console.log('LgzLib.MsgFrames.Parent.prototype.viewFullScreen');

    $f = this.$lgzFrame;
    
    $f.css('background', '#ff00ff');
    $f.css('position', 'fixed');
    $f.css('top', '0px');
    $f.css('left', '0px');
    
    w = parseInt($f.attr('width'), 10);
    h = parseInt($f.attr('height'), 10);
    
    ratio = h / w;
    
    w = $(window).width();
    h = Math.round(w * ratio);
    console.log('viewFullScreen: w x h: ' + w + ' x ' + h);
    
    this.$lgzFrame.width(w);
    this.$lgzFrame.height(h);

};
LgzLib.MsgFrames.Parent.prototype.viewNormal = function () {
    'use strict';
    var $f, w, h, ratio;
    console.log('LgzLib.MsgFrames.Parent.prototype.viewNormal');

    $f = this.$lgzFrame;
    
    $f.css('background', '#ff00ff');
    $f.css('position', '');
    $f.css('top', '');
    $f.css('left', '');
    
    w = parseInt($f.attr('width'), 10);
    h = parseInt($f.attr('height'), 10);
    console.log('viewFullScreen: w x h: ' + w + ' x ' + h);
    this.$lgzFrame.width(w);
    this.$lgzFrame.height(h);

};
LgzLib.MsgFrames.Parent.prototype.initFrame = function ($lgzFrame) {
    'use strict';
    if (!$lgzFrame) {
        this.$lgzFrame = $('#lgzFrame');
    } else {
        this.$lgzFrame = $lgzFrame;
    }
    this.childWin =  this.$lgzFrame[0].contentWindow;
    //todo: sendmsg to native parent if exists.
    //this.sendToParent(this.CK.FrameIsParent);
};
LgzLib.MsgFrames.Parent.prototype.eventSwitch = function (msg) {
    'use strict';
    var value;
    console.log('FrameParent.eventSwitch:  event: '
            + msg.event
            + ' value: ' + msg.value
        );
    switch (msg.event) {
    case this.CK.FrameIsLoader:
        break;
    case this.CK.FrameIsGame:
        break;
    case this.CK.GameParmsGet:
        value = this.gameParms();
        console.log('FrameParent/gameParms: gameid: ' + value.gameid);
        console.log('FrameParent/gameParms: gameSWF: ' + value.gameSWF);
        this.sendToChild(this.CK.GameParmsReply, value);
        break;

    case this.CK.OrientIsLandScape:
        //todo: set iframe width and height
        break;
    case this.CK.OrientIsPortrait:
        //todo: set iframe width and height
        break;
    case this.CK.ViewIsFullScreen:
        //todo?
        console.log('frameParent: ViewIsFullScreen');
        this.viewFullScreen();
        break;
    case this.CK.ViewIsNormal:
        //todo?
        this.viewNormal();
        break;
    }

};
//_______________________________________________________________
LgzLib.MsgFrames.Loader  = function () {
    'use strict';
    LgzLib.MsgFrame.call(this);
    
};
LgzLib.MsgFrames.Loader.lgzExtends(LgzLib.MsgFrame);
LgzLib.MsgFrames.Loader.prototype.loadGame = function (name) {
    'use strict';
    var href, idx;
    
    idx = location.pathname.search('/Frame');
    href = this.baseUrl.games
        + '/' + name + '/game.html?';
    console.log('LgzLib.MsgFrames.Loader: href: ' + href);
    
    //todo: test url exists before loading?
    //todo: have parent of iframe monitor for any fails from server
    // and provide message to user (network/svr down) etc.
    //
    location.href = href;
};
LgzLib.MsgFrames.Loader.prototype.loadInfoOK = function (data) {
    'use strict';
    var name;
    console.log('LgzLib.MsgFrameLoader.loadInfoOK');
    name = $(data).find('gameInfo').attr('gameSWF');
    this.loadGame(name);
};
LgzLib.MsgFrames.Loader.prototype.loadInfoFAIL = function (e) {
    'use strict';
    console.error('LgzLib.MsgFrameLoader.loadInfoFAIL:' + e.statusText);
};
LgzLib.MsgFrames.Loader.prototype.loadInfo = function (gameid) {
    'use strict';
    var thisObj, href;
    thisObj = this;
    href = this.urlInfo(gameid);
 
    $.get(href, function (data) {
        thisObj.loadInfoOK(data);
    }).error(function (e) {
        thisObj.loadInfoFAIL(e);
    });
};
LgzLib.MsgFrames.Loader.prototype.eventSwitch = function (msg) {
    'use strict';
    var parms, prop;
    console.log('FrameLoader.eventSwitch:  event: '
        + msg.event
        + ' value: '
        + msg.value);
    switch (msg.event) {
    case this.CK.GameParmsReply:
        parms = msg.value;
	    if (parms.baseUrl) {
            for (prop in parms.baseUrl) {
                if (parms.baseUrl.hasOwnProperty(prop)) {
		            this.baseUrl[prop] = parms.baseUrl[prop];
                }
            }
	    }
	    console.log('MsgFrames.Loader.eventSwich: gameSWF: ' + parms.gameSWF);
	    console.log('MsgFrames.Loader.eventSwich: gameid: ' + parms.gameid);
        if (parms.gameSWF && parms.gameSWF.length) {
	        console.log('MsgFrames.Loader.eventSwich: loadGame');
            this.loadGame(parms.gameSWF);
        } else {
            if (parms.gameid && parms.gameid.length) {
                console.log('MsgFrames.Loader.eventSwich: loadInfo');
                this.loadInfo(parms.gameid);
            } else {
                //todo: send errormsg back to parent of iframe to display error on native app
                console.error('MsgFrames.Loader.eventSwich: Missing gameid from parent of iframe');
            }
        }
        break;
    }

};
LgzLib.MsgFrames.Loader.prototype.initFrame = function () {
    'use strict';
    this.sendToParent(this.CK.FrameIsLoader);
    this.sendToParent(this.CK.GameParmsGet);
};
//_______________________________________________________________
LgzLib.MsgFrames.Game  = function (mgr, cbInit) {
    'use strict';
    this.lgzMgr = mgr;
    this.lgzHud = mgr.hud;
    this._cbInit = cbInit;
    LgzLib.MsgFrame.call(this);
};
LgzLib.MsgFrames.Game.lgzExtends(LgzLib.MsgFrame);
 
LgzLib.MsgFrames.Game.prototype.loadAccentsOK = function (data) {
    'use strict';
    var thisObj, i, set, charArr, strHTML, $ac, lgzInput;

    console.log('MsgFramesGame.loadAccentsOK:');
    
    thisObj = this;
    set = $(data).find('set');
    charArr = set.find('character');
    strHTML = '';
    for (i = 0; i < charArr.length; i += 1) {
        strHTML += '<a url="#" >' + charArr[i].innerHTML + '</a>';
    }
    if (charArr.length) {
        lgzInput = $('#lgzInput')[0];
        $ac = $('#lgzAccentBar');
        $ac[0].innerHTML = strHTML;
        if (lgzInput) {
            $ac.click(function (event) {
                if (event.target !== $ac[0]) {
                    thisObj.lgzHud.inputSelectReplace(event.target.innerHTML);
                }
            });
        }
    }

};
LgzLib.MsgFrames.Game.prototype.loadAccentsFAIL = function (e) {
    'use strict';
    console.error('LgzLib.MsgFrameGame.loadAccentsFAIL: ' + e.statusText);
    this.err = e;
};
LgzLib.MsgFrames.Game.prototype.loadAccents = function (gameid) {
    'use strict';
    var thisObj, href;
    thisObj = this;

    console.log('MsgFrames.Game.loadAccents:gameid: ' + gameid);

    href = this.urlInfo(gameid);
    console.log('MsgFrames.Game.loadAccents:href: ' + href);

    $.get(href, function (data) {
        thisObj.loadAccentsOK(data);
    }).error(function (e) {
        thisObj.loadAccentsFAIL(e);
    });
};
LgzLib.MsgFrames.Game.prototype.gameParmsUrl = function () {
    'use strict';
    var id, parms, gameid;

    parms = this.getJsonFromUrl();

    if (parms.gameid) {
        this.$lgzParms.attr('gameid', parms.gameid);

        if (parms.userid) {
            this.$lgzParms.attr('userid', parms.userid);
        }
        return true;
    }
    return false;

};
LgzLib.MsgFrames.Game.prototype._initFrame = function () {
    'use strict';
    var gameid;
    
    gameid = this.$lgzParms.attr('gameid');
    this.loadAccents(gameid);
    this._cbInit();
};
LgzLib.MsgFrames.Game.prototype.initFrame = function () {
    'use strict';
    this.$lgzParms = $('#lgzParms');
 
    
    if (this.gameParmsUrl()) {
        console.log('LgzLib.MsgFrames.Game.initFrame: gameParmsUrl true');
        this._initFrame();
    } else {
        this.sendToParent(this.CK.FrameIsGame);
        this.sendToParent(this.CK.GameParmsGet);
    }

};
LgzLib.MsgFrames.Game.prototype.eventSwitch = function (msg) {
    'use strict';
    var parms, prop;
    console.log('FrameGame.eventSwitch:  event: '
        + msg.event
        + ' value: '
        + msg.value);
    switch (msg.event) {
    case this.CK.GameParmsReply:
        parms = msg.value;
	    if (parms.baseUrl) {
            for (prop in parms.baseUrl) {
                if (parms.baseUrl.hasOwnProperty(prop)) {
		            this.baseUrl[prop] = parms.baseUrl[prop];
                }
            }
	    }
        this.$lgzParms.attr('gameid', parms.gameid);
        this.$lgzParms.attr('userid', parms.userid);
        this._initFrame();
        break;
    }
};

//_______________________________________________________________

LgzLib.MsgFrames.Native  = function () {
    'use strict';
    LgzLib.MsgFrame.Parent.call(this);
};
LgzLib.MsgFrames.Native.lgzExtends(LgzLib.MsgFrames.Parent);
