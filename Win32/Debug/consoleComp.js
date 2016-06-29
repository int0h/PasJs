var enums = require('./enums.js');
var enumGs = require('enum').enumGs;
var enumSetGs = require('enum').enumSetGs;
var delphiClasses = require('delphiClasses');
var comps = require('pjsBasicComponents/cmps.js');
var defClass = require('defClass');

var fs = require('fs');

var basicComps = require('pjsBasicComponents/cmps.js');
var formBased = require('./complexComp.js').formBased;


var Mixin = require('defClass/mixin').Mixin;
var MixAtom = require('defClass/mixin').MixAtom;

var objPath = require("./utils.js").objPath;
var getAllKeys = require("./utils.js").getAllKeys;
var onlyUnique = require("./utils.js").onlyUnique;
var objToString = require("./utils.js").objToString;

function getVarsStartWith(obj, str){
	return getAllKeys(obj)		
		.filter(function(i){
			return i.indexOf(str) == 0;
		})
		.filter(onlyUnique)
		.sort();
		//.slice(0, 10)
};

var cursor = 0;
//form.list.ItemIndex = cursor;

/*function refreshList(editObj, key){			
	var len = form.list._.Items.Count;	
	cursor = len > 0 ? (cursor % len) : 0;
	if (cursor < 0){
		cursor = len - cursor;
	};
	if (key == keyCodes.enter){		
		if (len == 0){
			form.evalBtn.emit('click');
			return;
		};
		var itemText = form.list._.Items[cursor];
		var newPath = form.edit._.Text.split('.').slice(0, -1).concat([itemText]).join('.');
		form.edit.value = newPath;
		form.edit._.SelStart = newPath.length;
	};
	var path = form.edit.value.split('.');
	var obj = objPath(path.slice(0, -1), global);	
	var lastChain = path.slice(-1)[0];
	form.list._.Items.Text = getVarsStartWith(obj, lastChain);


	var len = form.list._.Items.Count;
	//form.evalBtn.Caption = key;
	if (len == 0){return};
	if (key == keyCodes.up){
		if (cursor < 1){
			cursor = len;
		};
		cursor = (cursor - 1) % len;				
	};
	if (key == keyCodes.down){
		cursor = (cursor + 1) % len;				
	};	
	form.list._.ItemIndex = cursor;
};*/

function fullsizeElms(){
	//form.mainForm.label += '1';

	this.edit.x = 0;
	this.edit.y = this.boxElm.clientHeight - 20;
	this.edit.h = 20;
	this.edit.w = this.clientWidth;

	this.memo.x = 0;
	this.memo.y = 0;
	this.memo.h = this.boxElm.clientHeight - 22;
	this.memo.w = this.clientWidth;

};

function evalCode(code){
	var res = "!err!"; 	
	try{
		eval("res = " + code);
	}catch(e){
		res = e + '\n' + e.stack.replace(/\\\\n/g, '\n');
	}; 
	var text = '[type: ' + typeof res + ']\n' + objToString(res);
	return text;
};

function navigate(key){
	var len = this.list.items.length;
	//form.evalBtn.Caption = key;
	if (len == 0){
		this.historyCursor += key == keyCodes.up 
			? -1 
			: 1;
		if (this.historyCursor < 0){
			this.historyCursor = 0;
		};
		if (this.historyCursor >= this.history.length){
			this.historyCursor = this.history.length;
			this.edit.value = '';
			return;
		};		
		this.edit.value = this.history[this.historyCursor];
		return;
	};
	if (key == keyCodes.up){
		if (this.curPos < 1){
			this.curPos = len;
		};
		this.curPos = (this.curPos - 1) % len;				
	};
	if (key == keyCodes.down){
		this.curPos = (this.curPos + 1) % len;				
	};	
	this.list.selectedId = [this.curPos];	
};

function focusFix(elm){
	return;
	elm.on("click", function(){
		if (elm._.Focused()){
			return;
		};
		elm._.SetFocus();
	});
};

function compliteCode(completion){
	this.edit.value = this.edit.value.split('.').slice(0, -1).concat([completion]).join('.');
	this.edit._.SelStart = this.edit.value.length;
};

function refreshList(){
	var path = this.edit.value.split('.');
	var obj = objPath(path.slice(0, -1), global);	
	var lastChain = path.slice(-1)[0];
	this.list.items = getVarsStartWith(obj, lastChain);
	this.listForm.toggle(this.list.items.length > 0);
};

var keyCodes = {
	"left": 37,
	"up": 38,
	"right": 39,
	"down": 40,
	"enter": 13
};

module.exports = defClass({
	"name": "Console",
	"atoms": [
		new MixAtom({"target": "instance", priority: -1, "fn": function(self, opts){	
			var history = [];

			try {
				fs.accessSync('./consoleHistory.json', null);				
			}catch(e){
				fs.writeFileSync('./consoleHistory.json', '[]');
			};
			var historyJson = fs.readFileSync('./consoleHistory.json');
			history = JSON.parse(historyJson);
			self.history = history;
			self.historyCursor = history.length;

			self.label = "Console";		
			self.borderStyle =  enums.borderStyle.bsSizeToolWin;
			//self.boxElm.label = '';
			self.curPos = 0;

			var edit = new basicComps.Edit(self.boxElm);			
			self.edit = edit;
			var memo = new basicComps.Memo(self.boxElm);			
			self.memo = memo;
			memo.scrollBars = enums.scrollBars.ssVertical;
			memo.readOnly = true;
			var listForm = new basicComps.Form(null);
			//listForm.show();
			listForm.autoSize = true;
			listForm.borderStyle = 'bsNone';
			listForm._.FormStyle = enums.formStyle.fsStayOnTop
			self.listForm = listForm;
			var list = new basicComps.ListBox(listForm);
			self.list = list;
			list.items = [];

			self.boxElm.on("resize", fullsizeElms.bind(self));
			fullsizeElms.call(self);
			self.show();			

			[edit, memo].forEach(focusFix);

			edit.on("exit", function(){
				listForm.hide();
			});

			edit.on("keyUp", function(sender, key){
				if (!listForm.visible){
					var rec = {
						"X": self.x,
						"Y": self.y
					};
					rec = self.parent._.ClientToScreen(rec);
					//alert(objToString(rec));
					listForm.x = rec.X + 15;
					listForm.y = rec.Y - listForm.h + self.h - 35;
				//	listForm.show();
				};			
				if (key == keyCodes.enter){
					var completion = list.getSelected()[0];
					if (completion){
						compliteCode.call(self, completion);
						return;
					};
					var code = edit.value;
					//memo.value = evalCode.call(self, code);
					self.input(code);
					return;
				};
				if (key == keyCodes.up || key == keyCodes.down){
					navigate.call(self, key);					
					return;
				};
				refreshList.call(self);
				edit._.SetFocus();	
			});
		}})
	],
	"mixs": [
		formBased
	],
	"fields": {
		"log": function(str){
			this.memo.value += '=====-=====-=====\n'
				+ objToString(str) + '\n';
			this.memo.scrollToLine(this.memo.lineCount);
		},
		"input": function(str){		
			this.history.push(str);
			this.historyCursor = this.history.length;
			var historyJson = JSON.stringify(this.history, null, 4);
			fs.writeFileSync('./consoleHistory.json', historyJson);	

			var lines = [];
			lines.push('>> ' + str);
			var result = evalCode(str);
			lines.push(result);
			lines.push('=====-=====-=====');
			this.memo.value += lines.join('\n') + '\n';			
			this.memo.scrollToLine(this.memo.lineCount);			
		} 
	}
});