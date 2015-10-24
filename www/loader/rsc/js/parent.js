
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
Lgz.ParentIonic = function () {
   'use strict';
   this._$super('ParentNative','constructor');
};
Lgz.ParentIonic.lgzExtends(LgzLib.MsgFrames.ParentNative,'ParentNative');
Lgz._initFrameParentEvents = function ($lgzFrame, $scope, $ionicPopup) {
    'use strict';

    var frameParent,

        $navBar,
        origNavClass,

        $tabBar,
        $origTabClass,
        origTabClass,

        $playContent,
        origPlayContentClass;

    // console.log('Lgz.newMsgFrame:');

    frameParent = Lgz.frameParent;
    //
    // hide ionic navbar and tabbar during fullscreen 
    //
    $navBar  = $('#lgzNavBar');
    $origTabClass  = $('#lgzTabClass');
    $tabBar  = $origTabClass.parent();

    origNavClass = $navBar.attr('class');
    origTabClass = $tabBar.attr('class');

    $playContent  = $('#lgzPlayContent');
    // console.log('$playContent: ' + $playContent);

    origPlayContentClass = $playContent.attr('class');

    frameParent.eventViewFullScreen = function () {
        // console.log('frameParent.eventViewFullScreen:');


        $navBar.attr('class', 'hide');
        $tabBar.attr('class', 'hide');
        $playContent.attr('class', '');
	
        frameParent._$super('ParentNative','eventViewFullScreen');
        
    };
    //
    // restore ionic nav and tab bars
    //
    frameParent.eventViewNormal = function () {
        // console.log('frameParent.eventViewNormal:');

        $navBar.attr('class', origNavClass);
        $tabBar.attr('class', origTabClass);
        $playContent.attr('class', origPlayContentClass);

        frameParent._$super('ParentNative','eventViewNormal');

    };

    frameParent.eventAlertError = function (msg) {
        $ionicPopup.alert({
            title: "Error",
            template: msg
        }).then(function () {
            frameParent.eventViewNormal();
            frameParent.eventOrientNormal();
            $lgzFrame.attr('src', 'loader/error.html');
        });
    };

};
Lgz.initMsgFrameNative = function ($scope, $ionicPopup) {
    'use strict';
    var $lgzFrame;
    // console.log('Lgz.initMsgFrameNative:');
    $lgzFrame = $('#lgzFrame');

    if ($lgzFrame.length) {
        if (!Lgz.frameParent) {
	    // console.log('   !Lgz.frameParent');
            Lgz.frameParent = new Lgz.ParentIonic();
        } else {
	    // console.log('   Lgz.frameParent.attachToDOM');
            Lgz.frameParent.attachToDOM();
        }
        Lgz._initFrameParentEvents($lgzFrame, $scope, $ionicPopup);

        // console.log('initMsgFrame: adding loader url');
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
