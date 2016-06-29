(function(){
	var classes = {
		"sys_fs": sys_fs,
		"sys_showScrollBar": sys_showScrollBar,
		"evalFile": evalFile,
		"callDll": sys_callDll
	};

	var _callDll = sys_callDll;
	function callDll(dll, name){
		var args = [].slice.call(arguments, 2);
		//console.log(args);
		return sys_callDll.apply(null, [dll, name, true, args.length].concat(args));
	};
	//alert('asf');
	global.callDll = callDll;	

	delete global.sys_fs;
	delete global.evalFile;
	delete global.sys_showScrollBar;
	//delete global.sys_callDll;

	global.modules["delphiSystem"] = {"state": 0, "fn": function(exports, module){exports = module.exports;

		module.exports = classes;

	;return module.exports;}};
})();