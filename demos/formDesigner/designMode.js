var delphiClasses = require('delphiClasses');
var enums = require('pjsBasicComponents/enums.js');
var components = require('pjsBasicComponents/cmps.js');

global.d = false;
var sx = 0;
var sx = 0;
var vertRes, horRes;
var hint = new components.Hint();
//global.h = hint;
hint.hide();
hint._.DoubleBuffered = true;
/*hint.w = 32;
hint.h = 16;*/

function onMouseMove(sender, shift, x, y){	
	if (!this.designMode){return};
	/*if (ssShift in Shift){
		x = Math.round(x / 8)*8;
		y = Math.round(y / 8)*8;
	};
*/
	//MainForm.Caption = shift % 2 == 0 ? 8 : 0;
	hint.x = getCursorPos().x + this.w - x + 10;
  	hint.y = getCursorPos().y - y + 10;  	
	var border = 5;

	var gridStep = shift % 2 == 0 ? 10 : 1
	function grid(val){
		return Math.round(val / gridStep) * gridStep;
	};




	//global.s = sender;
	if (!d){
		horRes = 0;
		if (x < border){
			horRes = -1;
		};
		if (this.w - x < border){
			horRes = 1;
		};
		vertRes = 0;
		if (y < border){
			vertRes = -1;
		};
		if (this.h - y < border){
			vertRes = 1;
		};
	};
	//form.mainForm.label = (horRes)+':'+(vertRes);

	x = grid(x);
	y = grid(y);
	global.q = this;

	if (vertRes != 0 && horRes == 0){
		sender.Cursor = enums.cursor.crSizeNS;
	};
	if (vertRes == 0 && horRes != 0){
		sender.Cursor = enums.cursor.crSizeWE;
	};
	if (vertRes == horRes && Math.abs(horRes) == 1){
		sender.Cursor = enums.cursor.crSizeNWSE;
	};
	if (vertRes == -horRes && Math.abs(horRes) == 1){
		sender.Cursor = enums.cursor.crSizeNESW;
	};
	if (vertRes == horRes && horRes == 0){
		sender.Cursor = enums.cursor.crSizeAll;
	};


	if (!d){
		return;
	};
	if (vertRes == horRes && horRes == 0){
		this.x = grid(this.x - sx + x);
		this.y = grid(this.y - sy + y);
	};

	if (vertRes == 1){
		this.h = grid(y);
	};

	if (horRes == 1){
		this.w = grid(x);
	};

	if (vertRes == -1){
		//MainForm.Caption = grid(y);
		this.h = grid(this.h - y);
		this.y = grid(this.y + y);
	};
	if (horRes == -1){
		this.w = grid(this.w - x);
		this.x = grid(this.x + x);
	};

	if (vertRes == horRes && horRes == 0){
		hint.label = '(' + this.x + '; ' + this.y + ')';	
	}else{
		hint.label = '(' + this.w + '; ' + this.h + ')';
	};
	hint._.Refresh();
};

function onMouseDown(sender, button, shift, x, y){
	if (!this.designMode){return};
	d = true;
  	sx = x;
  	sy = y;
  	hint.show();
  	/*hint.x = x;
  	hint.y = y;*/

};

function onMouseUp(){
	if (!this.designMode){return};
	d = false;
	hint.hide();
};

function toggleDesignMode(compObj, val){
	if (compObj.designMode === undefined){
		Object.defineProperty(compObj, 'designMode', {
			value: false,
			writable: true
		});
		compObj.on('mouseDown', onMouseDown);
		compObj.on('mouseMove', onMouseMove);
		compObj.on('mouseUp', onMouseUp);
	};
	val = val || !compObj.designMode;
	compObj.designMode = val;		
	if (!val){
		compObj.cursor = 'crDefault';
	};	
	return compObj.designMode;
};

exports.toggleDesignMode = toggleDesignMode;