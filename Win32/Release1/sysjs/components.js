var delphiClasses = require('delphiClasses');
var EventEmitter = require('event-emitter');
var enums = require('./sysjs/enums.js');

/*
Align
Cursor

Color
Font
PopupMenu
*/

var nativeEvents = {
	"change": {name: "OnChange"},
	"click": {name: "OnClick"},
	"contextPopup": {name: "OnContextPopup"},
	"dblClick": {name: "OnDblClick"},
	"dragDrop": {name: "OnDragDrop"},
	"dragOver": {name: "OnDragOver"},
	"endDock": {name: "OnEndDock"},
	"endDrag": {name: "OnEndDrag"},
	"enter": {name: "OnEnter"},
	"exit": {name: "OnExit"},
	"gesture": {name: "OnGesture"},
	"keyDown": {name: "OnKeyDown"},
	"keyPress": {name: "OnKeyPress"},
	"keyUp": {name: "OnKeyUp"},
	"mouseActivate": {name: "OnMouseActivate"},
	"mouseDown": {name: "OnMouseDown"},
	"mouseEnter": {name: "OnMouseEnter"},
	"mouseLeave": {name: "OnMouseLeave"},
	"mouseMove": {name: "OnMouseMove"},
	"mouseUp": {name: "OnMouseUp"},
	"startDock": {name: "OnStartDock"},
	"startDrag": {name: "OnStartDrag"},
	"change": {name: "OnChange"},
	"click": {name: "OnClick"},
	"contextPopup": {name: "OnContextPopup"},
	"dblClick": {name: "OnDblClick"},
	"dragDrop": {name: "OnDragDrop"},
	"dragOver": {name: "OnDragOver"},
	"endDock": {name: "OnEndDock"},
	"endDrag": {name: "OnEndDrag"},
	"enter": {name: "OnEnter"},
	"exit": {name: "OnExit"},
	"gesture": {name: "OnGesture"},
	"keyDown": {name: "OnKeyDown"},
	"keyPress": {name: "OnKeyPress"},
	"keyUp": {name: "OnKeyUp"},
	"mouseActivate": {name: "OnMouseActivate"},
	"mouseDown": {name: "OnMouseDown"},
	"mouseEnter": {name: "OnMouseEnter"},
	"mouseLeave": {name: "OnMouseLeave"},
	"mouseMove": {name: "OnMouseMove"},
	"mouseUp": {name: "OnMouseUp"},
	"startDock": {name: "OnStartDock"},
	"startDrag": {name: "OnStartDrag"}
};

function mergeVisibility(protoObj){
	protoObj.show = function(){
		this._.Visible = true;
		return this;
	};
	protoObj.hide = function(){
		this._.Visible = false;
		return this;
	};
	protoObj.toggle = function(visibility){
		visibility = visibility || !this._.Visible;
		this._.Visible = visibility;
		return this;
	};
	Object.defineProperty(protoObj, 'visible', {
		"get": function(){
			return this._.Visible;
		},
		"set": function(val){
			this._.Visible = val;
		}
	});
};

function mergeEventEmitter(protoObj){
	protoObj.on = function(name, listenner){		
		var self = this;
		var nativeEvent = nativeEvents[name];
		var handled = this.handledEvents.indexOf(name) != -1;		
		if (nativeEvent && !handled){

			function handler(){
				self.eventEmitter.emit.apply(self.eventEmitter, [name].concat(arguments));
			};

			this._[nativeEvent.name] = handler;
			this.handledEvents.push(name);
		};
		return this.eventEmitter.on.call(this.eventEmitter, name, function(){
			return listenner.apply(self, arguments);
		});
	};

	protoObj.emit = function(){
		return this.eventEmitter.emit.apply(this.eventEmitter, arguments);
	};
};

function mergeMove(protoObj){
	var xDesc = {
		"get": function(){
			return this._.Left;
		},
		"set": function(val){
			this._.Left = val;
		}
	};
	var yDesc = {
		"get": function(){
			return this._.Top;
		},
		"set": function(val){
			this._.Top = val;
		}
	};
	Object.defineProperty(protoObj, 'x', xDesc);
	Object.defineProperty(protoObj, 'y', yDesc);
	Object.defineProperty(protoObj, 'left', xDesc);
	Object.defineProperty(protoObj, 'top', yDesc);
};

function mergeResize(protoObj){
	var wDesc = {
		"get": function(){
			return this._.Width;
		},
		"set": function(val){
			this._.Width = val;
		}
	};
	var hDesc = {
		"get": function(){
			return this._.Height;
		},
		"set": function(val){
			this._.Height = val;
		}
	};
	Object.defineProperty(protoObj, 'w', wDesc);
	Object.defineProperty(protoObj, 'h', hDesc);
	Object.defineProperty(protoObj, 'width', wDesc);
	Object.defineProperty(protoObj, 'height', hDesc);
};

function mergeAbility(protoObj){
	protoObj.enable = function(){
		this._.Enabled = true;
		return this;
	};
	protoObj.disable = function(){
		this._.Enabled = false;
		return this;
	};
	protoObj.toggleAbility = function(ability){
		ability = ability || !this._.Enabled;
		this._.Enabled = ability;
		return this;
	};
	Object.defineProperty(protoObj, 'enabled', {
		"get": function(){
			return this._.Enabled;
		},
		"set": function(val){
			this._.Enabled = val;
		}
	});
};

function mergeHint(protoObj){
	Object.defineProperty(protoObj, 'hint', {
		"get": function(){
			return this._.ShowHint ? this._.Hint : '';
		},
		"set": function(val){
			this._.ShowHint = val != '';
			this._.Hint = val;
		}
	});
};

function mergeValueLines(protoObj){
	Object.defineProperty(protoObj, 'value', {
		"get": function(){
			return this._.Lines.Text;
		},
		"set": function(val){
			this._.Lines.Text = val;
		}
	});
};

function mergeValueChecked(protoObj){
	Object.defineProperty(protoObj, 'value', {
		"get": function(){
			return this._.State;
		},
		"set": function(val){
			this._.State = val;
		}
	});
};

function mergeItems(protoObj){
	Object.defineProperty(protoObj, 'items', {
		"get": function(){
			return this._.Items.Text.split('\n\r');
		},
		"set": function(val){
			this._.Items.Text = val.join('\n');
		}
	});
};

function mergeSelectedItems(protoObj){
	Object.defineProperty(protoObj, 'selected', {
		"get": function(){
			var arr = [];
			var len = this._.Items.Count;
			for (var i = 0; i < len; i++){
				arr.push(this._.Selected[i]);
			};
			return arr;
		},
		"set": function(val){		
			if (!this._.MultiSelect){
				var lastSelected = 0;
				for (var i = 0; i < val.length; i++){
					if (val[i]){
						lastSelected = i;
					};
				};
				this._.ItemIndex = lastSelected;
				return;
			};
			var len = this._.Items.Count;
			for (var i = 0; i < len; i++){
				//this._.Selected[i] = val[i];
				sys_listBoxSetSelected(this._, i, !!val[i]);
			};					
		}
	});
};

function mergeSelectedId(protoObj){
	Object.defineProperty(protoObj, 'selectedId', {
		"get": function(){
			if (this._.MultiSelect){
				throw new Error('cannot get selectedId of multiSelect');
				return null;
			}else{
				return this._.ItemIndex;
			};
		},
		"set": function(val){		
			if (this._.MultiSelect){
				var arr = [];
				var len = this._.Items.Count;
				for (var i = 0; i < len; i++){
					arr[i] = i == val;
				};
				this.selected = arr;
			}else{
				this._.ItemIndex = val;
			};			
		}
	});
};

function mergePassword(protoObj){
	Object.defineProperty(protoObj, 'password', {
		"get": function(){
			var nullCh = this._.PasswordChar == sys_codeToChar(0);
			return nullCh ? null : this._.PasswordChar;
		},
		"set": function(val){
			if (!val){
				this._.PasswordChar = sys_codeToChar(0);
				return;
			};
			if (typeof val != 'string'){
				val = '*';
			};
			this._.PasswordChar = val[0];			
		}
	});
};

function mergeOpacity(protoObj){
	Object.defineProperty(protoObj, 'opacity', {
		"get": function(){
			if (!this._.AlphaBlend){
				return 1;
			};
			return this._.AlphaBlendValue / 255;
		},
		"set": function(val){
			if (val >= 1){
				this._.AlphaBlend = false;
				return;
			}else{
				this._.AlphaBlend = true;
			};
			this._.AlphaBlendValue = val * 255;			
		}
	});
};


// mapObj : {name: descriptor}
// descriptor: [nativeKey, enumObj, isSet]
function pipeEnums(protoObj, mapObj){
	for (var name in mapObj){
		var nativeKey = mapObj[name][0];
		var enumObj = mapObj[name][1];
		var defineFn = enums.defineEnumProp;
		if (mapObj[name][2]){
			defineFn = enums.defineEnumSetProp;
		};
		(function(nativeKey, enumObj, defineFn){			
			defineFn(enumObj, protoObj, name, {
				"get": function(){
					return this._[nativeKey];
				},
				"set": function(val){
					this._[nativeKey] = val;
				}
			});
		})(nativeKey, enumObj, defineFn);
	};
};

function pipeProps(protoObj, mapObj){
	for (var name in mapObj){
		var nativeKey = mapObj[name];
		(function(nativeKey){			
			Object.defineProperty(protoObj, name, {
				"get": function(){
					return this._[nativeKey];
				},
				"set": function(val){
					this._[nativeKey] = val;
				}
			});
		})(nativeKey);
	};
};


function mergeApply(protoObj, arr){
	arr.forEach(function(fn){
		fn(protoObj);
	});
};

// ###################################################################################
// ###################################################################################
// ###################################################################################
// ###################################################################################


// Components:


// ###################################################################################
// ###################################################################################
// ###################################################################################
// ###################################################################################

//============================	Form

//a =new c.Form(MainForm);a.on('click', function(){this.h += 15})
function Form(parent, options){
	var nativeObj = delphiClasses.TForm(parent);
	this._ = nativeObj;
	nativeObj.Parent = parent;
	this.eventEmitter = new EventEmitter();
	this.handledEvents = [];
};
mergeApply(Form.prototype, [
	mergeVisibility,
	mergeEventEmitter,
	mergeMove,
	mergeResize,
	mergeAbility,
	mergeHint,
	mergeOpacity
]);
pipeProps(Form.prototype, {

	/*'alphaBlend': 'AlphaBlend',
	AlphaBlendValue
	AutoScroll
	AutoSize
	BorderIcons
	BorderStyle
	ClientHeight
	ClientWidth
	DefaultMonitor
	FormStyle
	'label': 'Caption',
	'label': 'Caption',
	'label': 'Caption',
	'label': 'Caption',*/
	'autoScroll': 'AutoScroll',
	'autoSize': 'AutoSize',
	'clientHeight': 'ClientHeight',
	'clientWidth': 'ClientWidth',
	'label': 'Caption',
	'parent': 'Parent',
	'tabOrder': 'TabOrder'
});
pipeEnums(Form.prototype, {
	'cursor': ['Cursor', enums.cursor],
	'align': ['Align', enums.align],
	'borderStyle': ['BorderStyle', enums.borderStyle],
	'borderIcons': ['BorderIcons', enums.borderIcon, true],
	'formStyle': ['FormStyle', enums.formStyle],
	'defaultMonitor': ['DefaultMonitor', enums.defaultMonitor],

});

exports.Form = Form;


//============================	/Form


//============================	Button

//a =new c.Button(MainForm);a.on('click', function(){this.h += 15})
function Button(parent, options){
	var nativeObj = delphiClasses.TBitBtn(parent);
	this._ = nativeObj;
	nativeObj.Parent = parent;
	this.eventEmitter = new EventEmitter();
	this.handledEvents = [];
};
mergeApply(Button.prototype, [
	mergeVisibility,
	mergeEventEmitter,
	mergeMove,
	mergeResize,
	mergeAbility,
	mergeHint
]);
pipeProps(Button.prototype, {
	'label': 'Caption',
	'parent': 'Parent',
	'tabOrder': 'TabOrder'
});
pipeEnums(Button.prototype, {
	'cursor': ['Cursor', enums.cursor],
	'align': ['Align', enums.align]
});

exports.Button = Button;


//============================	/Button


//============================	Edit

//q=new delphiClasses.TEdit();getAllKeys(q).filter(function(i){return i.indexOf('On')==0})

//b =new c.Edit(MainForm);b.on('click', function(){this.h += 15})
function Edit(parent, options){
	var nativeObj = delphiClasses.TEdit(parent);
	this._ = nativeObj;
	nativeObj.Parent = parent;
	this.eventEmitter = new EventEmitter();
	this.handledEvents = [];
};
mergeApply(Edit.prototype, [
	mergeVisibility,
	mergeEventEmitter,
	mergeMove,
	mergeResize,
	mergeAbility,
	mergeHint,
	mergePassword
]);
pipeProps(Edit.prototype, {
	'parent': 'Parent',
	'value': 'Text',
	'readOnly': 'ReadOnly',
	'autoSelect': 'AutoSelect',
	'autoSize': 'AutoSize',
	'maxLength': 'MaxLength',
	'numbersOnly': 'NumbersOnly',
	'tabOrder': 'TabOrder'
});
pipeEnums(Edit.prototype, {
	'cursor': ['Cursor', enums.cursor],
	'align': ['Align', enums.align]
});
exports.Edit = Edit;

//============================	/Edit


//============================	Memo

function Memo(parent, options){
	var nativeObj = delphiClasses.TMemo(parent);
	this._ = nativeObj;
	nativeObj.Parent = parent;
	this.eventEmitter = new EventEmitter();
	this.handledEvents = [];
};
mergeApply(Memo.prototype, [
	mergeVisibility,
	mergeEventEmitter,
	mergeMove,
	mergeResize,
	mergeAbility,
	mergeHint,
	mergeValueLines
]);
pipeProps(Memo.prototype, {
	'parent': 'Parent',
	'readOnly': 'ReadOnly',
	'maxLength': 'MaxLength',
	'wantReturns': 'WantReturns',
	'wantTabs': 'WantTabs',
	'tabOrder': 'TabOrder'
});
pipeEnums(Memo.prototype, {
	'cursor': ['Cursor', enums.cursor],
	'align': ['Align', enums.align],
	'scrollBars': ['ScrollBars', enums.scrollBars]
});

exports.Memo = Memo;

//============================	/Memo



//============================	RichEdit

function RichEdit(parent, options){
	var nativeObj = delphiClasses.TRichEdit(parent);
	this._ = nativeObj;
	nativeObj.Parent = parent;
	this.eventEmitter = new EventEmitter();
	this.handledEvents = [];
};
mergeApply(RichEdit.prototype, [
	mergeVisibility,
	mergeEventEmitter,
	mergeMove,
	mergeResize,
	mergeAbility,
	mergeHint,
	mergeValueLines
]);
pipeProps(RichEdit.prototype, {
	'parent': 'Parent',
	'plainText': 'PlainText',
	'readOnly': 'ReadOnly',
	'maxLength': 'MaxLength',
	'wantReturns': 'WantReturns',
	'wantTabs': 'WantTabs',
	'tabOrder': 'TabOrder'
});
pipeEnums(RichEdit.prototype, {
	'cursor': ['Cursor', enums.cursor],
	'align': ['Align', enums.align],
	'scrollBars': ['ScrollBars', enums.scrollBars]
});

exports.RichEdit = RichEdit;



//============================	/RichEdit


//============================	RadioButton

function RadioButton(parent, options){
	var nativeObj = delphiClasses.TRadioButton(parent);
	this._ = nativeObj;
	nativeObj.Parent = parent;
	this.eventEmitter = new EventEmitter();
	this.handledEvents = [];
};
mergeApply(RadioButton.prototype, [
	mergeVisibility,
	mergeEventEmitter,
	mergeMove,
	mergeResize,
	mergeAbility,
	mergeHint
]);
pipeProps(RadioButton.prototype, {
	'label': 'Caption',
	'parent': 'Parent',
	'tabOrder': 'TabOrder',
	'value': 'Checked'
});
pipeEnums(RadioButton.prototype, {
	'cursor': ['Cursor', enums.cursor],
	'align': ['Align', enums.align]
});

exports.RadioButton = RadioButton;



//============================	/RadioButton


//============================	CheckBox

function CheckBox(parent, options){
	var nativeObj = delphiClasses.TCheckBox(parent);
	this._ = nativeObj;
	nativeObj.Parent = parent;
	this.eventEmitter = new EventEmitter();
	this.handledEvents = [];
};
mergeApply(CheckBox.prototype, [
	mergeVisibility,
	mergeEventEmitter,
	mergeMove,
	mergeResize,
	mergeAbility,
	mergeHint,
	mergeValueChecked
]);
pipeProps(CheckBox.prototype, {
	'label': 'Caption',
	'parent': 'Parent',
	'tabOrder': 'TabOrder',
	'allowGrayed': 'AllowGrayed'
});
pipeEnums(CheckBox.prototype, {
	'cursor': ['Cursor', enums.cursor],
	'align': ['Align', enums.align]
});

exports.CheckBox = CheckBox;



//============================	/CheckBox


//============================	ScrollBar

function ScrollBar(parent, options){
	var nativeObj = delphiClasses.TScrollBar(parent);
	this._ = nativeObj;
	nativeObj.Parent = parent;
	this.eventEmitter = new EventEmitter();
	this.handledEvents = [];
};
mergeApply(ScrollBar.prototype, [
	mergeVisibility,
	mergeEventEmitter,
	mergeMove,
	mergeResize,
	mergeAbility,
	mergeHint
]);
pipeProps(ScrollBar.prototype, {
	'parent': 'Parent',
	'tabOrder': 'TabOrder',
	'max': 'Max',
	'min': 'Min',
	'value': 'Position',
	'smallChange': 'SmallChange',
	'largeChange': 'LargeChange',
	'pageSize': 'PageSize'
});
pipeEnums(ScrollBar.prototype, {
	'cursor': ['Cursor', enums.cursor],
	'align': ['Align', enums.align],
	'orientation': ['Kind', enums.orientation]
});

exports.ScrollBar = ScrollBar;



//============================	/ScrollBar


//============================	TrackBar

function TrackBar(parent, options){
	var nativeObj = delphiClasses.TTrackBar(parent);
	this._ = nativeObj;
	nativeObj.Parent = parent;
	this.eventEmitter = new EventEmitter();
	this.handledEvents = [];
};
mergeApply(TrackBar.prototype, [
	mergeVisibility,
	mergeEventEmitter,
	mergeMove,
	mergeResize,
	mergeAbility,
	mergeHint
]);
pipeProps(TrackBar.prototype, {
	'parent': 'Parent',
	'tabOrder': 'TabOrder',
	'max': 'Max',
	'min': 'Min',
	'value': 'Position',
	'frequency': 'Frequency',
	'pageSize': 'PageSize',
	'selStart': 'SelStart',
	'selEnd': 'SelEnd',
	'thumbLength': 'ThumbLength',
	'sliderVisible': 'SliderVisible',
	'showSelRange': 'ShowSelRange',
	'lineSize': 'LineSize'
});
pipeEnums(TrackBar.prototype, {
	'cursor': ['Cursor', enums.cursor],
	'align': ['Align', enums.align],
	'orientation': ['Kind', enums.orientation],
	'tickStyle': ['TickStyle', enums.tickStyle],
	'tickMarks': ['TickMarks', enums.tickMarks],
	'positionToolTip': ['PositionToolTip', enums.positionToolTip],
});

exports.TrackBar = TrackBar;



//============================	/TrackBar


//============================	ProgressBar

function ProgressBar(parent, options){
	var nativeObj = delphiClasses.TProgressBar(parent);
	this._ = nativeObj;
	nativeObj.Parent = parent;
	this.eventEmitter = new EventEmitter();
	this.handledEvents = [];
};
mergeApply(ProgressBar.prototype, [
	mergeVisibility,
	mergeEventEmitter,
	mergeMove,
	mergeResize,
	mergeAbility,
	mergeHint
]);
pipeProps(ProgressBar.prototype, {
	'parent': 'Parent',
	'tabOrder': 'TabOrder',
	'max': 'Max',
	'min': 'Min',
	'value': 'Position',
	'marqueeInterval': 'MarqueeInterval',
	'smooth': 'Smooth',
	'smoothReverse': 'SmoothReverse'

});
pipeEnums(ProgressBar.prototype, {
	'cursor': ['Cursor', enums.cursor],
	'align': ['Align', enums.align],
	'orientation': ['Kind', enums.orientation],
	'state': ['State', enums.pbState],
	'style': ['Style', enums.pbStyle]
});

exports.ProgressBar = ProgressBar;



//============================	/TrackBar



//============================	Label

function Label(parent, options){
	var nativeObj = delphiClasses.TLabel(parent);
	this._ = nativeObj;
	nativeObj.Parent = parent;
	this.eventEmitter = new EventEmitter();
	this.handledEvents = [];
};
mergeApply(Label.prototype, [
	mergeVisibility,
	mergeEventEmitter,
	mergeMove,
	mergeResize,
	mergeAbility,
	mergeHint
]);
pipeProps(Label.prototype, {
	'parent': 'Parent',
	'label': 'Caption',
	'autoSize': 'AutoSize'
});
pipeEnums(Label.prototype, {
	'cursor': ['Cursor', enums.cursor],
	'align': ['Align', enums.align]
});

exports.Label = Label;

//============================	/Label



//============================	ListBox

function ListBox(parent, options){
	var nativeObj = delphiClasses.TListBox(parent);
	this._ = nativeObj;
	nativeObj.Parent = parent;
	this.eventEmitter = new EventEmitter();
	this.handledEvents = [];
};
mergeApply(ListBox.prototype, [
	mergeVisibility,
	mergeEventEmitter,
	mergeMove,
	mergeResize,
	mergeAbility,
	mergeHint,
	mergeItems,
	mergeSelectedItems,
	mergeSelectedId
]);
pipeProps(ListBox.prototype, {
	'parent': 'Parent',
	'label': 'Caption',
	'autoComplete': 'AutoComplete',
	'autoCompleteDelay': 'AutoCompleteDelay',
	'columns': 'Columns',
	'extendedSelect': 'ExtendedSelect',
	'multiSelect': 'MultiSelect',
	'sorted': 'Sorted',
	'tabWidth': 'TabWidth'	
});
pipeEnums(ListBox.prototype, {
	'cursor': ['Cursor', enums.cursor],
	'align': ['Align', enums.align]
});

exports.ListBox = ListBox;

//============================	/ListBox



//============================	ComboBox

function ComboBox(parent, options){
	var nativeObj = delphiClasses.TComboBox(parent);
	this._ = nativeObj;
	nativeObj.Parent = parent;
	this.eventEmitter = new EventEmitter();
	this.handledEvents = [];
};
mergeApply(ComboBox.prototype, [
	mergeVisibility,
	mergeEventEmitter,
	mergeMove,
	mergeResize,
	mergeAbility,
	mergeHint,
	mergeItems
]);
pipeProps(ComboBox.prototype, {
	'parent': 'Parent',
	'label': 'Caption',
	'autoCloseUp': 'AutoCloseUp',
	'autoComplete': 'AutoComplete',
	'autoCompleteDelay': 'AutoCompleteDelay',
	'autoDropDown': 'AutoDropDown',
	'maxLength': 'MaxLength',
	'sorted': 'Sorted',
	'value': 'ItemIndex',
	'text': 'Text'
});
pipeEnums(ComboBox.prototype, {
	'cursor': ['Cursor', enums.cursor],
	'align': ['Align', enums.align],
	'style': ['Style', enums.cbStyle]
});

exports.ComboBox = ComboBox;

//============================	/ComboBox







function createMenuItems(parent, itemsCfg){		

	itemsCfg.forEach(function(itemCfg){
		var item = new delphiClasses.TMenuItem(parent);
		item.Caption = itemCfg.title;
		if (itemCfg.items){
			createMenuItems(item, itemCfg.items);
		};
		parent.Add(item);			
	});
};

function MainMenu(parent, itemsCfg){

	

	var menu = new delphiClasses.TMainMenu(parent);
	var items = createMenuItems(menu.Items, itemsCfg);	
	return menu;
};

// var m = new MainMenu(MainForm, [
// 	{
// 		title: "File",
// 		items: [
// 			{title: "Save"},
// 			{title: "Open"}
// 		]
// 	},
// 	{title: "Project"},
// 	{title: "Tools"}
// ]);

exports.MainMenu = MainMenu;