nativeApp.Initialize();

global.process = {
	platform: "win32",
	arch: "x64",
	cwd: function(){return sys_cwd()}
};

global.modules = {};

/*function evalr(code){
	var __res; 
	eval('__res = ' + code); 
	return __res;
};*/

//global.evalr = evalr;
