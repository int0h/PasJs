var Mixin = require('mixin/core.js').Mixin;
var enums = require('enum');

function fnAim(target, fn){
	return {
		"target": target,
		"fn": fn
	};
};

function dataProxy(name){
	return [
		function(){
			return this.data[name];
		},
		function(val){
			this.data[name] = val;
		}
	];
};

function defDataClassFnFn(opts, classFn){				
	classFn.meta.types[opts.name] = opts.type;
	if (opts.default !== undefined){
		classFn.meta.defaults[opts.name] = opts.default;
	};
	return;
};

function defDataFn(opts, target){			
	if (opts.proxy){
		if (opts.type == "enum"){
			opts.proxy = enums.enumGs(opts.typeData, opts.proxy);
		};
		if (opts.type == "enumSet"){
			opts.proxy = enums.enumSetGs(opts.typeData, opts.proxy);
		};
	};
	var desc = {
		"enumerable": true,
		"configurable": false
	};
	if (opts.proxy){
		desc.get = opts.proxy[0].bind(target);
		desc.set = opts.readOnly 
			? function(){
				throw new Error('property ' + opts.name + ' is readOnly')
			} 
			: opts.proxy[1].bind(target);
	}else{
		desc.writable = !opts.readOnly;
		desc.value = opts.default;
	};	
	Object.defineProperty(target.data, opts.name, desc);
};

function defStaticPropFn(opts, targetClassFn){
	var desc = {
		"enumerable": true,
		"configurable": false,
		"writable": false,
		"value": opts.value
	};
	Object.defineProperty(targetClassFn.prototype, opts.name, desc);
};

function defPropFn(opts, targetClassFn){
	var desc = {
		"enumerable": true,
		"configurable": false
	};
	if (!opts.gs){
		opts.gs = dataProxy(opts.name);
	};
	desc.get = opts.gs[0];
	desc.set = opts.gs[1];
	Object.defineProperty(targetClassFn.prototype, opts.name, desc);
};			

function defSimplePropFn(opts, targetInstance){
	var desc = {
		"enumerable": ~opts.flags.indexOf('e'),
		"configurable": ~opts.flags.indexOf('c'),
		"writable": ~opts.flags.indexOf('w'),
		"value": opts.value
	};
	Object.defineProperty(targetInstance, opts.name, desc);	
};

function defMethodFn(opts, targetClassFn){
	var desc = {
		"enumerable": false,
		"configurable": false,
		"writable": false,
		"value": opts.fn
	};
	Object.defineProperty(targetClassFn.prototype, opts.name, desc);
};

function genDef(fn, target){
	return function(opts){
		return {
			"target": target,
			"fn": fn.bind(null, opts)
		};
	};
};

var defData = genDef(defDataFn, "instance");
var defDataClassFn = genDef(defDataClassFnFn, "classFn");
var defProp = genDef(defPropFn, "classFn");
var defMethod = genDef(defMethodFn, "classFn");
var defStaticProp = genDef(defStaticPropFn, "classFn");
var defSimpleProp = genDef(defSimplePropFn, "instance");

function alias(obj, src, desc){
	Object.defineProperty(obj, desc, {
		"get": function(){
			return this[src];
		},
		"set": function(val){
			this[src] = val;
		}
	})
};

function parseHelper(name, str){
	if (str[0] == "@"){
		var aliasTo = str.slice(1);
		var arg = [{"classFn": function(self, tn, opts){
				alias(self.prototype, aliasTo, name);
			}}];
		var meta = {props: {}};
		meta.props[name] = str;
		return {
			"arg": arg,
			"meta": meta
		};		
	};
};

/*function def(opts){	
	var defs = [];
	if (Array.isArray(opts)){
		opts.forEach(function(opt){
			defs = defs.concat(def(opt));
		});
		return defs;
	};
	//if ()
	for (var name in opts){
		var defOpt = opts[name];
		if (typeof defOpt == "function"){
			defs.push(defMethod({
				"name": name,
				"fn": defOpt
			}));
			continue;
		};
		if (typeof defOpt == "string"){
			defs = defs.concat(parseHelper(name, defOpt));
			continue;
		};
		if (Array.isArray(defOpt.type) && defOpt.type[0] instanceof enums.Enum){
			defOpt.typeData = defOpt.type[0];
			defOpt.type = "enumSet";
		};		
		if (defOpt.type instanceof enums.Enum){
			defOpt.typeData = defOpt.type;
			defOpt.type = "enum";
		};
		if (true){
			defOpt.name = name;
			defs.push(defData(defOpt));
			defs.push(defProp(defOpt));
		};
	};
	return defs;
};

function defMixin(opts){
	return new Mixin([
		def(opts)
	]);
};
*/

function nativeProxy(name){
	return [
		function(){
			return this.nativeObj[name];
		},
		function(val){
			this.nativeObj[name] = val;
		}
	]
};

function parseMetaObj(name, obj, mixinArg){
	if (!/^[\#]/.test(name)){
		return false;
	};
	//var name = name.slice(1);
	if (name == "#classFn"){
		mixinArg.push({
			"target": "classFn",
			"fn": obj
		});
		return true;
	};
	if (name == "#instance"){
		mixinArg.push({
			"target": "instance",
			"fn": obj
		});
		return true;
	};
	if (name == "#defaults"){
		mixinArg.push({
			"target": "classFn",
			"fn": function(classFn){
				for (i in obj){
					classFn.meta.defaults[i] = obj[i];
				};
			}
		});
		return true;
	};
	if (name == "#pipe"){
		for (var i in obj){
			var def = obj[i];
			var nativeName = i[0].toUpperCase() + i.slice(1);
			var opt = {};
			opt.type = typeof def;
			opt.default = def;			
			if (typeof def == "object"){
				nativeName = nativeName || def.name;
				opt.type = opt.type || def.type;
				opt.default = opt.default || def.default;
			};
			opt.proxy = nativeProxy(nativeName);
			opt.name = i;
			mixinArg.push(defDataClassFn(opt));
			mixinArg.push(defData(opt));
			mixinArg.push(defProp(opt));
		};
		return true;
	};
};

/*function defEnum(name, enumObj){
	return {
		"target": "classFn",
		"fn": function(classFn){
			Object.defineProperty(classFn.prototype, name, {
				"configurable": false,
				"enumerable": true,
				"get": function(){

				},
				"set": function(val){

				}
			});
		}
	}
};*/

function parseDef(opts){
	var meta = {
		"props": {}
	};
	var mixinArg = [];
	if (Array.isArray(opts)){
		mixinArg = mixinArg.concat(opts.map(function(opt){
			var parsed = parseDef(opt);
			for (var i in parsed.meta){
				meta.props[i] = parsed.meta.props[i];
			};
			return parsed.arg;	
		}));
		return {
			"arg": mixinArg,
			"meta": meta
		};
	};
	if (opts instanceof Mixin){
		return {
			"arg": opts,
			"meta": opts.meta
		};
	};
	for (var name in opts){
		if (parseMetaObj(name, opts[name], mixinArg)){
			continue;
		};
		var opt = opts[name];
		if (typeof opt == "function"){
			meta.props[name] = opt;
			mixinArg.push(defMethod({
				"name": name,
				"fn": opt
			}));
			continue;
		};
		if (typeof opt == "string"){
			var parsed = parseHelper(name, opt);
			mixinArg = mixinArg.concat(parsed.arg);
			for (var i in parsed.meta.props){
				meta.props[i] = parsed.meta.props[i];
			};
			continue;
		};
		if (Array.isArray(opt.type) && opt.type[0] instanceof enums.Enum){
			opt.typeData = opt.type[0];
			opt.type = "enumSet";
		};		
		if (opt.type instanceof enums.Enum){
			opt.typeData = opt.type;
			opt.type = "enum";
		};
		if (true){
			meta.props[name] = opt;
			opt.name = name;
			mixinArg.push(defDataClassFn(opt));
			mixinArg.push(defData(opt));
			mixinArg.push(defProp(opt));
		};
	};
	return {
		"arg": mixinArg,
		"meta": meta
	};
};

function defMixin(opts){
	if (arguments.length > 1){
		var args = [].slice.call(arguments);
		return defMixin.call(null, args);
	};
	var parsed = parseDef(opts);
	return new Mixin([
		parsed.arg
	], parsed.meta);
};
exports.defData = defData;
exports.defProp = defProp;
exports.defMethod = defMethod;
exports.defStaticProp = defStaticProp;
exports.fnAim = fnAim;
//exports.def = def;
exports.defMixin = defMixin;
exports.defMixin = defMixin;