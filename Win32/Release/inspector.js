var basicComps = require('pjsBasicComponents/cmps.js');
var enums = require('pjsBasicComponents/enums.js');
var cc = require('./complexComp.js');
var simpleDownLe = require('./simpleDownLe');
var defClass = require('defClass');
var formBased = require('./complexComp.js').formBased;
var panelBased = require('./complexComp.js').panelBased;


var Mixin = require('defClass/mixin').Mixin;
var MixAtom = require('defClass/mixin').MixAtom;

var typeEditTable = {
	"string": "Edit",
	"boolean": "CheckBox",
	"number": "Edit",
	"enum": "ComboBox"
};

var EditLine = defClass({
	"atoms": [
		//setOpts,
		new MixAtom({"target": "instance", "fn": function(self, opts){	
			self.name = opts.name;
			this.type = opts.type;
			var editClass = typeEditTable[opts.type];
			var edit = new basicComps[editClass](self.boxElm);
			edit.label = '';
			edit.x = 105;
			edit.y = 5;
			edit.w = 145;			

			edit.value = opts.value;
			edit._.Checked = opts.value;
			var label = new basicComps.Label(self.boxElm);
			label.x = 5;
			label.y = 5;
			label.w = 70;
			label.label = opts.name;	
			self.boxElm.w = 255;
			self.boxElm.h = 30;		

			self.edit = edit;

			edit.on("change", function(){
				self.emit("change");
			});
			edit.on("keyUp", function(){
				self.emit("change");
			});
			edit.on("click", function(){
				self.emit("change");
			});			
		}})
	],
	"mixs": [
		panelBased
	],
	"fields": {
		"value": {gs: [
			function(){
				return this.edit.value;
			},
			function(val){
				this.edit.value = val;
			}
		]}
	}
});

function objEach(obj, fn){
	for (var i in obj){
		fn(obj[i], i, obj);
	};
};

module.exports = defClass({
	"mixs": [
		formBased
	],
	"fields": {
		"clear": function(){			
			this.items.forEach(function(item){
				item.remove();
			});
			this.boxElm.layout = new simpleDownLe(this.boxElm);
			this.boxElm.layoutData = {margin: 5};
		},
		"refresh": function(){
			var self = this;
			this.items.forEach(function(item){
				item.edit.value = self.bound[item.name];
			});
		},
		"bind": function(comp){
			this.clear();
			var self = this;
			self.bound = comp;
			self.items = [];
			objEach(comp.data, function(value, name){
					//var value = comp.data[name];

				var fieldMeta = comp.constructor.meta.fields[name];
				if (!fieldMeta || !typeEditTable[fieldMeta.type]){
					return;
				};
				var type = fieldMeta.type;
				if (typeof type != "string"){
					type = "string";
				};

				var edit = new EditLine(self.boxElm, {
					"name": name,
					"type": type,
					"value": value
				});
				self.items.push(edit);
				edit.on("change", function(){						
					try{
						var val = edit.value;
						if (type == "number"){
							val = parseFloat(val) || 0;
						};
						comp.data[name] = val;
					}catch(e){
						alert(type + '|' +  name + '|' + e);
					}
				});			
			});
			comp.on("resize", function(){
				self.refresh(comp);
			});				
			comp.on("move", function(){
				self.refresh(comp);
			});
		}
	},
	"atoms": [
		new MixAtom({"target": "instance", priority: -1, "fn": function(self, opts){	
			self.borderStyle = 'bsToolWindow';
			self.show();
			self.label = 'Inspector';
			self.boxElm._.VertScrollBar.Tracking = true;
			self.autoScroll = true;

			self.boxElm.layout = new simpleDownLe(self.boxElm);
			self.boxElm.layoutData = {margin: 5};
			/*self.layoutChild = {
				"side": "right",
				"height": "100%",
				"width": 300
			};*/
			var items = [];
			self.items = items;
			
		}})
	]
});

//module.exports = EditLine;