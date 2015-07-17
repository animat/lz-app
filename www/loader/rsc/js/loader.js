
/*global
	$: true,
	Phaser: true,
	K: true,
	console: true,
	window: true,
	LgzLib: true
 */
/*jslint  nomen: true */
var g = {};

var Lgz = Lgz || {};

if ($('#lgzLoader').length) {
    console.log('loader.js: found loader frame: #lgzLoader');
    Lgz.frameLoader = new LgzLib.MsgFrames.Loader();
}
