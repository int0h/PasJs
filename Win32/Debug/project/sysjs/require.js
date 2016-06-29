(function(){

	var tpl = ['{"state": 0, "fn": function(exports, require, module, __filename, __dirname){'
		+ 'exports = module.exports;', 
		';return module.exports;}};'];

	function pathExist(filepath){
		try{
			fs.accessSync(filepath);
			return true;
		}catch(e){
			return false;
		}
	};

	global.nodeModulesPath = undefined;
	global.findNodeModules = findNodeModules;
	
	function findNodeModules(){
		var cur = process.cwd();
		while(!found){
			var nmPath = path.resolve(cur, './node_modules');
			var found = pathExist(nmPath);
			if (found){
				nodeModulesPath = nmPath;
				return;
			};
			var newCur = path.resolve(cur, '..');
			if (cur == newCur){
				nodeModulesPath = null;
				return;
			};
			cur = newCur;
		};		
	};	

	function resolveNodeModule(modulePath){
		if (nodeModulesPath === undefined){
			findNodeModules();
		};
		if (nodeModulesPath === null){
			throw new Error("cannot find " + modulePath + ": node_modules is not found");
		};
		var absModulePath = path.resolve(nodeModulesPath, './' + modulePath);
		return resolveAbsPath(absModulePath);		
	};

	function resolveAbsPath(absPath){
		if (/[\s\S]*\.js/.test(absPath)){
			return absPath;
		};
		if (pathExist(absPath + '.js')){
			return absPath + '.js';
		};
		if (pathExist(absPath)){
			return resolveDir(absPath);
		};
		throw new Error("cannot find " + absPath + ": node_modules is not found");
	};

	function resolveDir(dirPath){
		var packageJsonPath = dirPath + '/package.json';
		if (pathExist(packageJsonPath)){
			var jsonCode = fs.readFileSync(packageJsonPath);
			var parsed = JSON.parse(jsonCode);
			var scriptPath = path.resolve(dirPath, parsed.main);
			return scriptPath;
		};
		var indexPath = dirPath + '/index.js';
		if (pathExist(indexPath)){
			return indexPath;
		};
		throw new Error("cannot find " + indexPath);			
	};

	function resolvePath(curDir, unixPath){		
		var localRelativeRe = /^((\.\/)|(\.\.\/)|(\/))/;
		if (localRelativeRe.test(unixPath)){
			var absPath = path.win32.resolve(curDir, unixPath);
			var resolved = resolveAbsPath(absPath);
			return resolved;
		};	
		return resolveNodeModule(unixPath);	
	};

	function evalr(code, filename){		

		delphiSystem.evalFile('__res = ' + code, filename); 		

		var res = global.__res;
		if (!res){
			throw new Error('Bad syntax of module: ' + filename);
		};
		delete global.__res;
		return res;
	};

	function absRequire(curDir, filepath){		
		var module = global.modules[filepath];
		if (!module){
			var resolvedPath = resolvePath(curDir, filepath);		
			module = global.modules[resolvedPath];
		};
		if (!module){
			var code = fs.readFileSync(resolvedPath);
			var moduleObj = evalr(tpl.join(code), resolvedPath);
			global.modules[filepath] = moduleObj;
			global.modules[resolvedPath] = moduleObj;
			module = moduleObj;
			module.filename = resolvedPath;
			if (path && module.filename){
				module.dirname = path.win32.dirname(resolvedPath);
			};
		};
		if (module.state > 0){
			return module.result;
		};
		module.result = {};
		module.state = 1;
		try {
			var moduleObj = {"exports": {}};
			module.result = module.fn.call(
				moduleObj.exports, 
				moduleObj.exports, 
				absRequire.bind(null, module.dirname), 
				moduleObj,
				module.filename,
				module.dirname
			);
		}catch(err){
			throw new Error('Error of requiring ' 
				+ filepath 
				+ ' modlue\n\n' 
				+ err 
				+ '\n\n' 
				+ err.stack);
		};
		module.state = 2;
		return module.result;	
	};

	global.modules["require"] = {"state": 0, "fn": function(exports, require, module){exports = module.exports;	
		exports.require = absRequire;
	;return module.exports;}};


	var require = absRequire.bind(null, process.cwd());
	var path = require('path');
	global.require = require;
	var fs = require('fs');
	var delphiSystem = require('delphiSystem');


})();

