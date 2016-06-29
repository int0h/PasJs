function Enum(enumObj){
	var obj = enumObj;
	var vals = [];
	if (Array.isArray(enumObj)){
		obj = {};
		enumObj.forEach(function(name, val){
			obj[name] = val;
			vals.push(val);
		});		
	}else{
		for (var i in enumObj){
			vals.push(enumObj[i]);
		};
	};
	obj._values = vals;
	return obj;
};

function getEnumVal(enumObj, val){
	if (typeof val == 'string'){
		val = enumObj[val];
	};
	if (enumObj._values.indexOf(val) == -1){
		throw new Error('invalid enum value', enumObj, val);
	};
	return val;
};

function defineEnumProp(enumObj, obj, name, desc){
	Object.defineProperty(obj, name, {
		"get": function(){
			var val = desc.get.call(this);
			return val;
		},
		"set": function(val){			
			val = getEnumVal(enumObj, val);
			desc.set.call(this, val);
		}
	});
};

function defineEnumSetProp(enumObj, obj, name, desc){
	Object.defineProperty(obj, name, {
		"get": function(){
			var val = desc.get.call(this);
			return val;
		},
		"set": function(val){			
			var vals = val.map(getEnumVal.bind(null, enumObj));
			var res = vals.reduce(function(b, c){
				return b + Math.pow(2, c);
			}, 0);
			desc.set.call(this, res);			
		}
	});
};

exports.defineEnumProp = defineEnumProp;
exports.defineEnumSetProp = defineEnumSetProp;
exports.Enum = Enum;

exports.align = new Enum(["alNone", "alTop", "alBottom", "alLeft", "alRight", "alClient", "alCustom"]);
exports.scrollBars = new Enum(["ssNone", "ssHorizontal", "ssVertical", "ssBoth"]);
exports.cursor = new Enum({
	"crDefault": 0,
	"crNone": -1,
	"crArrow": -2,
	"crCross": -3,
	"crIBeam": -4,
	"crSize": -22,
	"crSizeNESW": -6,
	"crSizeNS": -7,
	"crSizeNWSE": -8,
	"crSizeWE": -9,
	"crUpArrow": -10,
	"crHourGlass": -11,
	"crDrag": -12,
	"crNoDrop": -13,
	"crHSplit": -14,
	"crVSplit": -15,
	"crMultiDrag": -16,
	"crSQLWait": -17,
	"crNo": -18,
	"crAppStart": -19,
	"crHelp": -20,
	"crHandPoint": -21,
	"crSizeAll": -22
});
exports.orientation = new Enum(["horizontal", "vertical"]);
exports.tickStyle = new Enum(["tsNone", "tsAuto", "tsManual"]);
exports.tickMarks = new Enum(["tmBottomRight", "tmTopLeft", "tmBoth"]);
exports.positionToolTip = new Enum(["ptNone", "ptTop", "ptLeft", "ptBottom", "ptRight"]);
exports.pbState = new Enum(["pbsNormal", "pbsError", "pbsPaused"]);
exports.pbStyle = new Enum(["pbstNormal", "pbstMarquee"]);
exports.cbStyle = new Enum(["csDropDown", "csSimple", "csDropDownList", "csOwnerDrawFixed", "csOwnerDrawVariable"]);
exports.borderStyle = new Enum(["bsNone", "bsSingle", "bsSizeable", "bsDialog", "bsToolWindow", "bsSizeToolWin"]);
exports.borderIcon = new Enum(["biSystemMenu", "biMinimize", "biMaximize", "biHelp"]);
exports.formStyle = new Enum(["fsNormal", "fsMDIChild", "fsMDIForm", "fsStayOnTop"]);
exports.defaultMonitor = new Enum(["dmDesktop", "dmPrimary", "dmMainForm", "dmActiveForm"]);




