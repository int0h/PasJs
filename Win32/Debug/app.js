//alert("hello world!");
//var formMgr = require('./form.js');
function ComponentContext(){
	this.elms = [];
	this.doc = {};
};
var globalContext = new ComponentContext();

global.c = require('pjsBasicComponents/cmps.js');
global.cc = require('./complexComp.js');
global.Console = require('./consoleComp.js');
global.CmpPalette = require('./cmpPalette.js');
global.Inspector = require('./inspector.js');
global.tdm = require('./designMode.js');
global.path = require('path');
global.objToString = require('./utils.js').objToString;
var delphiClasses = require("delphiClasses");
global.EventEmitter = require('event-emitter');
var enums = require('pjsBasicComponents/enums.js');
var lodash = require('lodash');
var moment = require('moment');
var simpleDownLe = require('./simpleDownLe');

function getCursorPos(){
	var res = {};
	var nativeRes = getCursorPosition();
	res.x = nativeRes.X;
	res.y = nativeRes.Y;
	return res;
};

var fs = require('fs');
var form = new c.Form(null, {"mainForm": true});
form.w = 720;
form.h = 480;

var lo2 = require('./layout2.js');
form.layout = new lo2(form);

var console = new Console(form);
console.h = 250;

var inspector = new Inspector(form);

var cmpPallete = new CmpPalette(form);

var view = new c.Form(form);
view.show();
view.on("mouseDown", elmMD);

function elmMD(sender, btn, shift, x, y){
	d = true;
	if (cmpPallete.selected){
		var elm = new c[cmpPallete.selected](this);
		elm.x = x;
		elm.y = y;
		elm.on("mouseDown", elmMD);
		tdm.toggleDesignMode(elm);
		inspector.bind(elm);
		cmpPallete.clearSelection();
		return;
	};
	global.sel = this;
	inspector.bind(this);
};


function grid(){
	for (var i = 0; i<100; i++){
		form._.Canvas.MoveTo(0, 10 * i);
		form._.Canvas.LineTo(1000, 10 * i);
	};
	for (var i = 0; i<100; i++){
		form._.Canvas.MoveTo(10 * i, 0);
		form._.Canvas.LineTo(10 * i, 1000);
	};
};

function placeComps(){
	cmpPallete.y = 0;
	cmpPallete.x = form.clientW - cmpPallete.w;
	cmpPallete.h = form.clientH / 2;

	console.w = form.clientW - cmpPallete.w;
	console.x = 0;
	console.y = form.clientH - console.h;

	inspector.y = cmpPallete.h;
	inspector.x = form.clientW - cmpPallete.w;
	inspector.h = form.clientH / 2;

	view.x = 0;
	view.y = 0;
	view.w = form.clientW - cmpPallete.w;
	view.h = form.clientH - console.h;
};

form.on("resize", placeComps);

console.edit.on("keyUp", function(sender, key){
	if (key == 116){ // F5
		shellExec(nativeApp.Handle, null, nativeApp.ExeName, null, null, 1);
		nativeApp.Terminate();
	};
});

function save(name){

	function cursorReset(child){
		child.cursor = enums.cursor.crArrow;
		child.children.forEach(cursorReset);
	};

	cursorReset(view);
	var json = view.toJson(null, 4);
	fs.writeFileSync('./project/' + name + '.json', json);
};

function load(name){
	var json = fs.readFileSync('./project/' + name + '.json');	
	view.fromJson(json);	

	function init(child){
		tdm.toggleDesignMode(child);	
		child.on("mouseDown", elmMD);	
		child.children.forEach(init);		
	};
	init(view);
};

//form.show();
//alert();
form._.WindowState = 2;
setTimeout('placeComps();', 1);

var finish = new Date();
nativeApp.Run();

