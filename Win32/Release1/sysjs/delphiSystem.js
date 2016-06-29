(function(){
	var classes = {
		"sys_fs": sys_fs,
		"sys_showScrollBar": sys_showScrollBar,
		"evalFile": evalFile
	};

	delete global.sys_fs;
	delete global.evalFile;
	delete global.sys_showScrollBar;

	global.modules["delphiSystem"] = {"state": 0, "fn": function(exports, module){exports = module.exports;

		module.exports = classes;

	;return module.exports;}};
})();