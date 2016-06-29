global.modules["fs"] = {"state": 0, "fn": function(exports, require, module){exports = module.exports;

var delphiSystem = require("delphiSystem");
var dFs = new delphiSystem.sys_fs;

exports.accessSync = function accessSync(filename, mode){
	mode = mode || 0;
	var res = dFs.accessSync(filename, mode);
	if (res){
		throw new Error(filename + ' is not avaliable in mode [' 
			+ mode 
			+ '] - currently only existance checks');
	};	
};	

exports.readFileSync = function readFileSync(filename){
	return dFs.readFile(filename);
};	

exports.writeFileSync = function writeFileSync(filename, data){
	return dFs.writeFile(filename, data);
};	

;return module.exports;}};