(function(){
	var classes = {
		"TTimer": TTimer,
		"THintWindow": THintWindow, 

		"TStreamWriter": TStreamWriter, 
		"TFileStream": TFileStream, 

		"TForm": TForm, 

		// text inputs
		"TEdit": TEdit, 
		"TMemo": TMemo, 
		"TRichEdit": TRichEdit, 

		// inputs
		"TBitBtn": TBitBtn, 
		"TButton": TButton, 
		"TRadioButton": TRadioButton, 
		"TCheckBox": TCheckBox, 
		"TScrollBar": TScrollBar, 
		"TTrackBar": TTrackBar, 

		// lists
		"TListBox": TListBox, 
		"TComboBox": TComboBox, 

		// visual
		"TPanel": TPanel, 
		"TScrollBox": TScrollBox, 
		"TImage": TImage, 
		"TProgressBar": TProgressBar, 
		"TLabel": TLabel, 

		"TRadioGroup": TRadioGroup, 
		"TGroupBox": TGroupBox, 
		"TTreeView": TTreeView, 

		// menus
		"TMainMenu": TMainMenu, 
		"TMenuItem": TMenuItem, 
		"TPopupMenu": TPopupMenu, 
		
		// dialogs
		"TOpenDialog": TOpenDialog, 
		"TSaveDialog": TSaveDialog, 
		"TFontDialog": TFontDialog, 
		"TColorDialog": TColorDialog, 
		"TPrintDialog": TPrintDialog
	};

	delete global.THintWindow; 
	delete global.TStreamWriter; 
	delete global.TFileStream; 
	delete global.TForm; 
	delete global.TEdit; 
	delete global.TMainMenu; 
	delete global.TMenuItem; 
	delete global.TPopupMenu; 
	delete global.TLabel; 
	delete global.TMemo; 
	delete global.TBitBtn; 
	delete global.TButton; 
	delete global.TCheckBox; 
	delete global.TRadioButton; 
	delete global.TListBox; 
	delete global.TComboBox; 
	delete global.TScrollBar; 
	delete global.TRadioGroup; 
	delete global.TGroupBox; 
	delete global.TPanel; 
	delete global.TScrollBox; 
	delete global.TImage; 
	delete global.TRichEdit; 
	delete global.TTrackBar; 
	delete global.TProgressBar; 
	delete global.TTreeView; 
	delete global.TOpenDialog; 
	delete global.TSaveDialog; 
	delete global.TFontDialog; 
	delete global.TColorDialog; 
	delete global.TPrintDialog;

	global.modules["delphiClasses"] = {"state": 0, "fn": function(exports, module){exports = module.exports;

		module.exports = classes;

	;return module.exports;}};
})();