
/*global
	$: true,
	Phaser: true,
	K: true,
	console: true,
    screen: true,
	window: true,
	LgzLib: true
 */
/*jslint  nomen: true */

var Lgz = Lgz || {};

Lgz.newMsgFrame = function () {
    'use strict';

    var frameParent, $navBar, $tabBar, $origTabClass, origNavClass, origTabClass;

    console.log('Lgz.newMsgFrame:');

    frameParent = new LgzLib.MsgFrames.ParentNative();
    
    // note: here we put display orientation
    // back to normal after game exits
    // - assuming display should return to locked portrait mode.
    frameParent.eventOrientNormal = function () {
        console.log('frameParent.eventOrientNormal:');
        screen.lockOrientation('portrait');
    };

    //
    // hide ionic navbar and tabbar during fullscreen 
    //
    $navBar  = $('#lgzNavBar');
    $origTabClass  = $('#lgzTabClass');
    $tabBar  = $origTabClass.parent();

    origNavClass = $navBar.attr('class');
    origTabClass = $tabBar.attr('class');


    frameParent.eventViewFullScreen = function () {
        console.log('frameParent.eventViewFullScreen:');

        frameParent._super.eventViewFullScreen.call(frameParent);
        $navBar.attr('class', 'hide');
        $tabBar.attr('class', 'hide');
        
    };
    //
    // restore ionic nav and tab bars
    //
    frameParent.eventViewNormal = function () {
        console.log('frameParent.eventViewNormal:');

        frameParent._super.eventViewNormal.call(frameParent);
        $navBar.attr('class', origNavClass);
        $tabBar.attr('class', origTabClass);
    };


    Lgz.frameParent = frameParent;
};
Lgz.initMsgFrameNative = function () {
    'use strict';
    var $lgzFrame;
    $lgzFrame = $('#lgzFrame');
    if ($lgzFrame.length) {
        if (!Lgz.frameParent) {
            Lgz.newMsgFrame();
        } else {
            Lgz.frameParent.attachToDOM();
        }
        console.log('initMsgFrame: adding loader url');
        $lgzFrame.attr('src', 'loader/loader.html');
    } else {
        console.error('initMsgFrame: no lgzFrame found!');
    }

};
//for debuging iframe focus issues
var g = g || {};
Lgz.parentDebug = function (w, wid) {
    'use strict';
    /*
    w.document.addEventListener(
        "onfocus",
        function (event) {
            console.error('window ' + wid + ':  focused');
        },
        false
    );
    w.document.addEventListener(
        "onblur",
        function (event) {
            console.error('window ' + wid + ':  blurred');
        },
        false
    );
    */
    w.onfocus = function () {
        console.error('window ' + wid + ':  focused');
    };
    w.onblur = function () {
        console.error('window ' + wid + ':  blurred');
    };
    w.document.addEventListener(
        "touchstart",
        function (event) {
            console.error('window ' + wid + ':  touchstart');
        },
        false
    );
    w.document.addEventListener(
        "touchend",
        function (event) {
            console.error('window ' + wid + ':  touchend');
            w.focus();
        },
        false
    );

};
