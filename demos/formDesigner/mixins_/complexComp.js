/*var EventEmitter = require('event-emitter');
var enums = require('../sysjs/enums.js');
var comps = require('../sysjs/comps.js');

var Mixin = require('./mixin.js').Mixin;
var defMixin = require('./helpers.js').defMixin;

var compMixins = {};



//#######################################################


var panelBased = defMixin({
	"#instance": function(self, opts){
		var parent = opts.parent;
		self.boxElm = new comps.Panel(parent, {});
	}
});

compMixins.PaletteElm = defMixin(panelBased, {
	"#instance": function(self){
		var elm = new opts.classFn(self.boxElm, {});
		elm.x = 100;
		elm.y = 5;
		elm.w = 150;
		self.w = 255;
		self.h = Math.min(elm.h, 40);
	}
});


//#######################################################


objEach(compMixins, function(mixin, name){
	var classFn = function(parent, opts){	
		opts = opts || {};			
		opts.parent = parent;		
		mixin.instance(this, opts);
		for (var i in classFn.meta.defaults){
			this.data[i] = classFn.meta.defaults[i];
		};
	};
	mixin.classFn(classFn);
	classFn.meta.name = name;
	exports[name] = classFn;	
});
*/