function Mixin(opts, meta){
	var self = this;
	this.meta = meta;
	this.onceFns = [];
	this.everyFns = [];

	function iterate(def){
		if (Array.isArray(def)){
			def.forEach(iterate);
			return;
		};
		if (def instanceof Mixin){
			self.mixSelf(def);
			return;
		};
		if (def.target == "classFn"){
			self.onceFns.push(def.fn);
		};
		if (def.target == "instance"){
			self.everyFns.push(def.fn);
		};
	};
	opts.forEach(iterate);
};

Mixin.prototype.classFn = function(classFn){
	this.onceFns.forEach(function(fn){
		fn.call(classFn, classFn);
	});				
};

Mixin.prototype.instance = function(thisObj){
	var args = [].slice.call(arguments).slice(1);
	this.everyFns.forEach(function(fn){
		fn.apply(thisObj, [thisObj].concat(args));
	});
};

Mixin.prototype.mix = function(mixed){
	if (!(mixed instanceof Mixin)){
		mixed = new Mixin(mixed);
	};
	return mix([this, mixed]);
};

Mixin.prototype.mixSelf = function(mixed){
	if (!(mixed instanceof Mixin)){
		mixed = new Mixin(mixed);
	};			
	return mix([mixed], this);
};

var metaMix = function(collector, mixed){
	for (var i in mixed.meta.props){
		collector.meta.props[i] = mixed.meta.props[i];
	};
};

function mix(mixins, collector){
	var collector = collector || new Mixin([], {"props": {}});
	mixins.forEach(function(mixin){
		metaMix(collector, mixin);
		collector.onceFns = collector.onceFns.concat(mixin.onceFns);
		collector.everyFns = collector.everyFns.concat(mixin.everyFns);
	});
	return collector;
};

exports.Mixin = Mixin;
exports.mix = mix;