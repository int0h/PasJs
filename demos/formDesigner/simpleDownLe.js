function SimpleDownLE(owner){
	this.curY = 0;
	this.owner = owner;
};

SimpleDownLE.prototype.place = function(parent, child){
	//alert(objToString(child));
	var margin = parent.layoutData.margin;
	var childY = this.curY + margin;
	//alert(childY);
	this.curY = childY + child.h;
	child.y = childY;
	child.x = margin;
	//alert(this.curY);
	var res = {
		"x": margin,
		"y": childY,
		"w": child.w,
		"h": child.h
	};
	//alert(JSON.stringify(res));
};

SimpleDownLE.prototype.refresh = function(){
	var self = this;
	this.curY = 0;
	this.owner.children.forEach(function(child){
		self.place(self.owner, child);
	});
};

module.exports = SimpleDownLE;