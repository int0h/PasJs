global.modules["timers"] = {"state": 0, "fn": function(exports, require, module){exports = module.exports;

var curId = 0;
var timers = [];
var DelphiTimer = require('delphiClasses').TTimer;

function setTimer(repeat, fn, time){
	if (typeof fn == "string"){
		fn = new Function(fn);
	};
	var args = [].slice.call(arguments, 3);	
	var data = {};
	var timer = new DelphiTimer(null);
	data.timer = timer;
	timer.OnTimer = repeat ? intervalHandler : timeoutHandler;
	timer.Enabled = true;
	timer.Interval = time;
	var id = curId;

	function timeoutHandler(){
		clearTimer(id);
		fn.apply(null, args);
	};

	function intervalHandler(){
		fn.apply(null, args);
	};

	timers[id] = data;
	curId++;
	return id;
};

function clearTimer(id){
	timers[id].timer.Enabled = false;
	timers[id].timer.Free();
	delete timers[id];
};

exports.setInterval = setTimer.bind(null, true);
exports.setTimeout = setTimer.bind(null, false);
exports.clearInterval = clearTimer;
exports.clearTimeout = clearTimer;


;return module.exports;}};
