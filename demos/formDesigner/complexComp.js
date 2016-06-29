var EventEmitter = require('event-emitter');
var enums = require('./enums.js');
var enumGs = require('enum').enumGs;
var enumSetGs = require('enum').enumSetGs;
var delphiClasses = require('delphiClasses');
var comps = require('pjsBasicComponents/cmps.js');

var ms = require('pjsBasicComponents/mixins.js');
var Mixin = require('mixin/core.js').Mixin;
var defMixin = require('mixin/helpers.js').defMixin;
var defClass = require('defClass');

var Mixin = require('defClass/mixin').Mixin;
var MixAtom = require('defClass/mixin').MixAtom;

var getAllKeys = require("./utils.js").getAllKeys;

function objEach(obj, fn){
	for (var i in obj){
		fn(obj[i], i, obj);
	};
};

var compMixins = {};


function nativeProxy(name){
	return [
		function(){
			return this.nativeObj[name];
		},
		function(val){
			//alert(objToString(this));
			//alert((new Error).stack.split(':'));
			this.nativeObj[name] = val;
		}
	]
};

function nativeBoxGs(name){
	return [
		function(){
			return this.boxElm[name]
		},
		function(val){
			this.boxElm[name] = val
		}
	];
};

function pipeBoxProps(propNames, fromClass){
	var obj = {};
	propNames.forEach(function(name){
		var propCfg = {};
		propCfg.type = fromClass.meta.types[name];
		if (fromClass.meta.defaults.hasOwnProperty(name)){
			propCfg.default = fromClass.meta.defaults[name];
		};
		propCfg.gs = nativeBoxGs(name);
		obj[name]  = propCfg;
	});
	return obj;
};

var pipeAllBoxProps = new MixAtom({"target": "instance", "fn": function(self){
	getAllKeys(self.boxElm).forEach(function(i){
		if (self[i]){return};
		var prop = self.boxElm[i];			
		if (typeof prop == "function"){
			self[i] = self.boxElm[i].bind(self.boxElm);
		}else{
			var gs = nativeBoxGs(i);
			Object.defineProperty(self, i, {
				"configurable": false,
				"enumerable": true,
				"get": gs[0],
				"set": gs[1]
			});
		}
	});
}});

var setOpts = new MixAtom({"target": "instance", "priority": -1, "fn": function(self, opts){
	alert(objToString(opts));
}});


var BoxPanel = defClass({
	"mixs": [comps.Panel], 
	"subtract": [
		ms.mixins.layout,
		ms.mixins.makeParent
	]
});

var BoxForm = defClass({
	"mixs": [comps.Form], 
	"subtract": [
		ms.mixins.layout,
		ms.mixins.makeParent
	]
});

//#######################################################

var panelBased = defClass({
	"mixs": [
		ms.mixins.layout,
		ms.mixins.makeParent
	],
	"atoms": [
		new MixAtom({"target": "instance", "priority": 1, "fn": function(self, opts){
			self.context = new ComponentContext();
			var parent = opts.parent;
			self.boxElm = new BoxPanel(parent, {
				"context": self.context
			});
			self.boxElm.label = '';
			self.eventEmitter = self.boxElm.eventEmitter;
			self.on = self.boxElm.on.bind(self.boxElm);
			self.emit = self.boxElm.emit.bind(self.boxElm);
			self.handledEvents = self.boxElm.handledEvents;
		}}),
		pipeAllBoxProps
	]
});


var formBased = defClass({
	"mixs": [
		ms.mixins.layout,
		ms.mixins.makeParent
	],
	"atoms": [
		new MixAtom({"target": "instance", "priority": 1, "fn": function(self, opts){
			self.context = new ComponentContext();
			var parent = opts.parent;
			self.boxElm = new BoxForm(parent, {
				"context": self.context
			});
			self.eventEmitter = self.boxElm.eventEmitter;
			self.on = self.boxElm.on.bind(self.boxElm);
			self.emit = self.boxElm.emit.bind(self.boxElm);
			self.handledEvents = self.boxElm.handledEvents;
		}}),
		pipeAllBoxProps
	]
});

compMixins.PaletteItem = defClass({
	"atoms": [
		//setOpts,
		new MixAtom({"target": "instance", "fn": function(self, opts){
			var elm = new opts.classFn(self.boxElm, {});
			elm.show();
			elm.x = 100;
			elm.y = 5;
			elm.w = 150;
			elm.h = Math.min(elm.h, 100);
			elm.value = opts.classFn.meta.name;
			elm.label = opts.classFn.meta.name;
			elm.items = ["item1", "item2", "item3"];
			self.boxElm.w = 255;
			self.boxElm.h = Math.min(elm.h + 10, 120);
			self.boxElm.label = '';
			var label = new comps.Label(self.boxElm, {});
			label.x = 5;
			label.y = 5;
			label.label = opts.classFn.meta.name + ':';
			self.cursor = 'crHandPoint';
			self._.ParentBackground = false;

			label.on("click", function(){
				self.emit("click");
			});			
		}})
	],
	"mixs": [
		panelBased
	]
});





//#######################################################


objEach(compMixins, function(mixin, name){
/*	var classFn = function(parent, opts){	
		opts = opts || {};			
		opts.parent = parent;		
		mixin.instance(this, opts);
	};
	mixin.classFn(classFn);
	classFn.meta.name = name;*/
	mixin.meta.name = name;
	exports[name] = mixin;	
});

exports.panelBased = panelBased;
exports.formBased = formBased;
