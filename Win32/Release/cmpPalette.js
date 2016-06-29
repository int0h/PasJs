var basicComps = require('pjsBasicComponents/cmps.js');
var cc = require('./complexComp.js');
var simpleDownLe = require('./simpleDownLe');
var defClass = require('defClass');
var formBased = require('./complexComp.js').formBased;


var Mixin = require('defClass/mixin').Mixin;
var MixAtom = require('defClass/mixin').MixAtom;

var clss = [];
for (var i in basicComps){
	if (/^[A-Z]/.test(i)){
		clss.push(i);
	};
};

module.exports = defClass({
	"mixs": [
		formBased
	],
	"fields": {
		"selected": {type: "string", default: null},
		"clearSelection": function(){
			this.selected = null;
			this.items.forEach(function(item){
				item.boxElm._.Color = enums.systemColors.btnFace;
			});
		}
	},
	"atoms": [
		new MixAtom({"target": "instance", priority: -1, "fn": function(self, opts){	
			self.borderStyle = 'bsToolWindow';
			self.boxElm._.VertScrollBar.Tracking = true;
			self.show();
			self.label = 'Palette';
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

			clss.slice(1,77).forEach(function(className, id){
				var cls = basicComps[className];

				var item = new cc.PaletteItem(self.boxElm, {
					"parent": self,
					"classFn": cls
				});

				items.push(item);

				item.on("click", function(){
					self.clearSelection();
					self.selected = className;
					self.emit("selected", self.selected);
					item.boxElm._.Color = 0xa0fac0;
				});				
			});
			
		}})
	]
})