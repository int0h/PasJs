(function(){

	var timers = require('timers');
	global.setInterval = timers.setInterval;
	global.setTimeout = timers.setTimeout;
	global.clearInterval = timers.clearTimer;
	global.clearTimeout = timers.clearTimer;
	
})();