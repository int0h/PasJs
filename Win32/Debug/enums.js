var Enum = require('enum');
Enum = function function_name (argument) {
    
};

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

var systemColor = 0xFF000000;
// System Colors (Windows only)
var cSCROLLBAR = 0;
var cBACKGROUND = 1;
var cACTIVECAPTION = 2;
var cINACTIVECAPTION = 3;
var cMENU = 4;
var cWINDOW = 5;
var cWINDOWFRAME = 6;
var cMENUTEXT = 7;
var cWINDOWTEXT = 8;
var cCAPTIONTEXT = 9;
var cACTIVEBORDER = 10;
var cINACTIVEBORDER = 11;
var cAPPWORKSPACE = 12;
var cHIGHLIGHT = 13;
var cHIGHLIGHTTEXT = 14;
var cBTNFACE = 15;
var cBTNSHADOW = 0x10;
var cGRAYTEXT = 17;
var cBTNTEXT = 18;
var cINACTIVECAPTIONTEXT = 19;
var cBTNHIGHLIGHT = 20;
var c3DDKSHADOW = 21;
var c3DLIGHT = 22;
var cINFOTEXT = 23;
var cINFOBK = 24;
var cHOTLIGHT = 26;
var cGRADIENTACTIVECAPTION = 27;
var cGRADIENTINACTIVECAPTION = 28;
var cMENUHILIGHT = 29;
var cMENUBAR = 30;
var cENDCOLORS = cMENUBAR;
var cDESKTOP = cBACKGROUND;
var c3DFACE = cBTNFACE;
var c3DSHADOW = cBTNSHADOW;
var c3DHIGHLIGHT = cBTNHIGHLIGHT;
var c3DHILIGHT = cBTNHIGHLIGHT;
var cBTNHILIGHT = cBTNHIGHLIGHT;
exports.systemColors = new Enum({
    "scrollBar": systemColor | cSCROLLBAR,
    "background": systemColor | cBACKGROUND,
    "activeCaption": systemColor | cACTIVECAPTION,
    "inactiveCaption": systemColor | cINACTIVECAPTION,
    "menu": systemColor | cMENU,
    "window": systemColor | cWINDOW,
    "windowFrame": systemColor | cWINDOWFRAME,
    "menuText": systemColor | cMENUTEXT,
    "windowText": systemColor | cWINDOWTEXT,
    "captionText": systemColor | cCAPTIONTEXT,
    "activeBorder": systemColor | cACTIVEBORDER,
    "inactiveBorder": systemColor | cINACTIVEBORDER,
    "appWorkSpace": systemColor | cAPPWORKSPACE,
    "highlight": systemColor | cHIGHLIGHT,
    "highlightText": systemColor | cHIGHLIGHTTEXT,
    "btnFace": systemColor | cBTNFACE,
    "btnShadow": systemColor | cBTNSHADOW,
    "grayText": systemColor | cGRAYTEXT,
    "btnText": systemColor | cBTNTEXT,
    "inactiveCaptionText": systemColor | cINACTIVECAPTIONTEXT,
    "btnHighlight": systemColor | cBTNHIGHLIGHT,
    "3DDkShadow": systemColor | c3DDKSHADOW,
    "3DLight": systemColor | c3DLIGHT,
    "infoText": systemColor | cINFOTEXT,
    "infoBk": systemColor | cINFOBK,
    "hotLight": systemColor | cHOTLIGHT,
    "gradientActiveCaption": systemColor | cGRADIENTACTIVECAPTION,
    "gradientInactiveCaption": systemColor | cGRADIENTINACTIVECAPTION,
    "menuHighlight": systemColor | cMENUHILIGHT,
    "menuBar": systemColor | cMENUBAR,

	"none": 0x1FFFFFFF,
	"default": 0x20000000
})


