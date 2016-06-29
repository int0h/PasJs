var fs = new _fs();

var classes = require('delphiClasses');

function capitalize(str){
	return str.slice(0, 1).toUpperCase() + str.slice(1); 
};

function FormFramework(){

};

FormFramework.prototype.read = function(schemeJson){	
	var resObj = {};

	schemeJson.forEach(function(i, id){
		var elmClass = classes[i.type];
		var elm = new elmClass(MainForm);
		elm.Name = 'n' + id;		
		elm.Parent = MainForm;
		resObj[i.id] = elm;
		var opts = i.options || {};
		for (var key in opts){						
			var cKey = capitalize(key);
			elm[cKey] = opts[key];
		};
	});

	return resObj;
};

FormFramework.prototype.load = function(path){
	var code = fs.readFile(path);
	return this.read(JSON.parse(code));
};

module.exports = new FormFramework;
