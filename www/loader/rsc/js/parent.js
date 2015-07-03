
/*global
	$: true,
	Phaser: true,
	K: true,
	console: true,
	window: true,
	LgzLib: true
 */
/*jslint  nomen: true */

var Lgz = Lgz || {};

Lgz.eventFrameInit = function () {
    'use strict';
    var $lgzFrame;
    $lgzFrame = $('#lgzFrame');
    if ($lgzFrame.length) {
        if (!Lgz.frameParent) {
            console.log('parent.js: found parent frame: #lgzFrame');
            Lgz.frameParent = new LgzLib.MsgFrames.Parent();
        } else {
            Lgz.frameParent.initFrame($lgzFrame);
        }
        console.log('eventFrameInit: adding loader url');
        $lgzFrame.attr('src', 'loader/loader.html');
    } else {
        console.error('eventFrameInit: no lgzFrame found!');
    }

}
