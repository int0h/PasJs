function objPath(path, obj, newVal){
	if (path.length < 1){
		return obj;
	};
	var propName = path[0];
	if (path.length == 1){
		if (newVal !== undefined){
			obj[propName] = newVal; // this doesn't work
		};		
		return obj[propName];	
	};
	var subObj = obj[propName];
	if (subObj === undefined){
		return undefined; // throw?
	};		
	return objPath(path.slice(1), subObj);
};

function getProtoChain(obj, chain){
	chain = chain || [];
	if (obj === undefined || obj === null){
		return chain;
	};
	if (typeof obj == "object"){
		var proto = Object.getPrototypeOf(obj);	
	}else{
		var proto = obj.__proto__;
	};
	if (proto === undefined || proto === null || proto === Object.prototype){
		return chain;
	};
	var parentChain = getProtoChain(proto, chain.concat([proto]));
	return parentChain;
};

function getProtoDesc(obj, propName){
	var chain = [obj].concat(getProtoChain(obj));
	for (var i = 0; i < chain.length; i++){
		var cur = chain[i];
		var desc = Object.getOwnPropertyDescriptor(cur, propName);
		if (desc){
			return desc;
		};
	};
	return undefined;
};

function canConfigProp(obj, key){ // broken
	var protos = [obj].concat(getProtoChain(obj));
	for (var i = 0; i < protos.length; i++){
		var proto = protos[i];
		var desc = Object.getOwnPropertyDescriptor(proto, key);
		if (desc && !desc.enumerable){
			return false;
		};
	};
	return true;
};

function getAllKeys(obj){	
	if (obj === undefined || obj === null){
		return [];
	};
	obj = ({}).valueOf.call(obj);
	var protoKeys = getProtoChain(obj).reduce(function(arr, cur){
		return arr.concat(Object.getOwnPropertyNames(cur))
	}, []);
	var ownKeys = [];
	try {
		ownKeys = Object.getOwnPropertyNames(obj);
	}catch(e){
		
	};/*
	var ownKeys = typeof obj == 'object' 
		? Object.getOwnPropertyNames(obj) 
		: [];*/
	var keys = ownKeys.concat(protoKeys).filter(function(i){
		return !/^\s*$/.test(i);
	});
	return keys.filter(onlyUnique);
};

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
};

function shortStr(str, maxLen){
	var suffix = str.length > maxLen ? '...' : '';
	return str.slice(0, maxLen) + suffix;
};

function objToString(obj){
	try{
		if (Array.isArray(obj)){
			return '[' + obj.join(', ') + ']';
		};
		if (obj === null){
			obj = "{null}";
		};
		if (typeof obj == "object"){
			var keys = getAllKeys(obj);
			var inner = keys.map(function(key,id,arr){
				console.log(keys.slice(id));
				if (obj.constructor && delphiClasses[obj.constructor.name]){
					return '    "' + key + '": [native property]';
					// e.g. cannot read Touch prop
				};
				// var desc = getProtoDesc(obj, key);
				// var canRead = desc && !desc.get;
				var val = '(...)';
				if (true){	
					val = obj[key];	
					if (obj[key]){
						val = obj[key];
						if (obj[key].toString){
							val = obj[key]
								.toString()
								.replace(/\s+/g, ' ');
							val = shortStr(val, 130);								
						}else{
							val = typeof val;
						};
					};					
				};
				return '    "' + key + '": ' + val;
			}).join(',\n');
			var text = ['{', inner, '}'].join('\n');
			return text;
		};
		
		return obj;
	}catch(e){
		alert(e + ':' + e.stack + obj);
	}
};

exports.objPath = objPath;
exports.getProtoChain = getProtoChain;
exports.getProtoDesc = getProtoDesc;
exports.canConfigProp = canConfigProp;
exports.getAllKeys = getAllKeys;
exports.onlyUnique = onlyUnique;
exports.objToString = objToString;