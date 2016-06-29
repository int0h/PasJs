function Layout2(owner){
	this.owner = owner;
	this.spacing = 10;
	this.sides = {
		"top": {
			"y": 0,
			"w": 0,
			"h": 0
		},
		"left": {
			"x": 0,
			"w": 0,
			"h": 0
		},
		"bottom": {
			"y": 0,
			"w": 0,
			"h": 0
		},
		"right": {
			"x": 0,
			"w": 0,
			"h": 0
		}
	};
};

/*function stick(side, child, childW){
	if (side == "top"){
		if ()

	};
};*/

function parseSize(side, child, parent){
	var shortSide = side == "width" ? "w" : "h";
	var childS = child.layoutChild[side];
	if (typeof childS == "string"){
		if (!/^[0-9]+\%$/g.test(childS)){
			throw new Error(childS + ' is not correct width value');
		};
		childS = parseInt(childS) / 100 * parent[shortSide];		
	};
	if (childS !== undefined){
		child[shortSide] = childS;
	};
	return child;
};

function placeToSide(side, child, parent){
	var clientSize = (side == "top" || side == "bottom")
		? "clientW"
		: "clientH";
	var shortSide =  clientSize = (side == "top" || side == "bottom")
		? "w"
		: "h";	
		
	if (parent[clientSize] < child[shortSide]){
		throw new Error("child size is too big to fit");
	};	
	if (parent[clientSize] - this.sides[side][shortSide] < child[shortSide]){
		throw new Error("child size is too big to fit");
	};


};

Layout2.prototype.place = function(parent, child){
	if (!child.layoutChild){return};
	child.w = parseSize("width", child, parent);
	child.h = parseSize("height", child, parent);

	var side = child.layoutChild.side;

	if (side == "top"){
		if (parent.clientW - this.sides[side].w < child.w){
			if (parent.clientW < child.w){
				throw new Error("child width is too big to fit");
			};
			this.sides[side].y += this.sides[side].h;
			this.sides[side].w = child.w;
			this.sides[side].h = child.h;
			child.x = 0;
			child.y = this.sides[side].y;
		};
		child.x = this.sides[side].w;
		child.y = this.sides[side].y;
		this.sides[side].w += child.w;
	};

	if (side == "left"){
		if (parent.clientH - this.sides[side].h < child.h){
			if (parent.clientH < child.h){
				throw new Error("child height is too big to fit");
			};
			this.sides[side].x += this.sides[side].w;
			this.sides[side].h = child.h;
			this.sides[side].w = child.w;
			child.y = 0;
			child.x = this.sides[side].x;
		};
		child.x = this.sides[side].w;
		child.y = this.sides[side].y;
		this.sides[side].h += child.h;
	};

	if (side == "bottom"){
		if (parent.clientW - this.sides[side].w < child.w){
			if (parent.clientW < child.w){
				throw new Error("child width is too big to fit");
			};
			this.sides[side].y += this.sides[side].h;
			this.sides[side].w = child.w;
			this.sides[side].h = child.h;
			child.x = 0;
			child.bottom = this.sides[side].y;
		};
		child.x = this.sides[side].w;
		child.bottom = this.sides[side].y;
		this.sides[side].w += child.w;
	};

	if (side == "right"){
		if (parent.clientH - this.sides[side].h < child.h){
			if (parent.clientH < child.h){
				throw new Error("child height is too big to fit");
			};
			this.sides[side].x += this.sides[side].w;
			this.sides[side].h = child.h;
			this.sides[side].w = child.w;
			child.y = 0;
			child.right = this.sides[side].x;
		};
		child.right = this.sides[side].w;
		child.y = this.sides[side].y;
		this.sides[side].h += child.h;
	};
};

Layout2.prototype.refresh = function(){
	var self = this;
	this.sides = {
		"top": {
			"y": 0,
			"w": 0,
			"h": 0
		},
		"left": {
			"x": 0,
			"w": 0,
			"h": 0
		},
		"bottom": {
			"y": 0,
			"w": 0,
			"h": 0
		},
		"right": {
			"x": 0,
			"w": 0,
			"h": 0
		}
	};
	this.owner.children.forEach(function(child){
		self.place(self.owner, child);
	});
};

module.exports = Layout2;