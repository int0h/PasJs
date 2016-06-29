program Project1;


uses
  // delphi untis
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Vcl.StdCtrls, Vcl.ExtCtrls, Vcl.Menus, Vcl.ComCtrls,
  Vcl.Buttons, Vcl.Themes, XPMan, ShellAPI,

  System.UITypes,

  // delphi-js requirements
  RTTI, typinfo,

  //delphi-js
  js15decl, jsintf, jsDbgServer,

  //my:
  fs,

  ogl2d, o2common, o2canvas, o2sprite, o2frameList, o2texture, Textures, OpenGL;

type

  TJSGlobalFunctions = class
    class function sys_callDll(Dll: String; const Name: String; HasResult: Boolean;
      paramCount: Integer; const p0, p1, p2, p3, p4, p5, p6, p7, p8, p9: Cardinal): Cardinal;
    class function sys_allocString(str: string): Pointer;
    class procedure sys_freeMemory(p : Pointer);
    class procedure delay(d: Cardinal);
    class procedure alert(s: string);
    class function shellExec(h: HWND; op, fn, p, dir: string; sc: Integer): NativeUInt;
    class function sendMsg(hWnd: HWND; Msg: UINT; wParam: WPARAM; lParam: LPARAM): LRESULT;
    class function evalFile(code, filename: string): Boolean;
    class function sys_showScrollBar(hWnd: HWND; wBar: Integer; bShow: BOOL): BOOL;
    class function sys_cwd(): String;
    class function sys_charToString(ch: Char): String;
    class function sys_stringToChar(str: String): Char;
    class function sys_charToCode(ch: Char): Integer;
    class function sys_codeToChar(code: Integer): Char;
    class procedure sys_listBoxSetSelected(ListBox: TListBox; id: Integer; selected: Boolean);
    class procedure PaintText(Pos, Length: Integer; Color: Cardinal);
    class function getCursorPosition(): TPoint;
    class function sys_getSysColor(sysColor: Integer): Cardinal;
    class function createMainForm(): TForm;
    class function rega(): Integer;
    class function a(ob: To2TextureStorage): To2Sprite;
    class function b(dc: HDC; w,h :Integer): To2Sprite;
  end;

  tp = class
    x,y: Integer;
  end;

  hw = class
    public
      msg: string;
      p: tp;
      property m: string read msg write msg;
      constructor create();
  end;

  function reg(JSEngine: TJSEngine): Integer; external 'o2gl.dll';

var

  FJSEngine: TJSEngine;
  f: TForm;

  constructor hw.create;
  begin
  p := tp.Create();
  end;



//{$R *.dfm}

//http://www.swissdelphicenter.ch/torry/showcode.php?id=1745
class function TJSGlobalFunctions.a(ob: To2TextureStorage): To2Sprite;
begin
  Result := To2Sprite.create(ob);

end;

class function TJSGlobalFunctions.b(dc: HDC; w,h :Integer): To2Sprite;
var
  c: To2Canvas;
begin
  c := To2Canvas.create(dc, w,h);
  Result := To2Sprite.create(c.textureStorage);

end;

class function TJSGlobalFunctions.sys_allocString(str: string): Pointer;
var
  p : ^String;
begin
ShowMessage(intTostr(sizeof(str)));
  GetMem(p, SizeOf(str));
  p^ := str;
  Result := PChar(p^);
end;

class procedure TJSGlobalFunctions.sys_freeMemory(p : Pointer);
begin
  FreeMem(p);
end;

class function TJSGlobalFunctions.rega(): Integer;
begin
  reg(FJSEngine);
end;

function DynamicDllCallName(Dll: String; const Name: String; HasResult: Boolean; var Returned: Cardinal; const Parameters: array of Pointer): Boolean;
var
  prc: Pointer;
  x, n: Integer;
  p: Pointer;
  dllh: THandle;
begin
  dllh := GetModuleHandle(PChar(Dll));
  if dllh = 0 then begin
    dllh := LoadLibrary(PChar(Dll));
  end;
  if dllh <> 0 then begin
    prc := GetProcAddress(dllh, PChar(Name));
    if Assigned(prc) then begin
      n := High(Parameters);
      if n > -1 then begin
        x := n;
        repeat
          p := Parameters[x];
          asm
            PUSH p
          end;
          Dec(x);
        until x = -1;
      end;
      asm
        CALL prc
      end;
      if HasResult then begin
        asm
          MOV p, EAX
        end;
        Returned := Cardinal(p);
      end else begin
        Returned := 0;
      end;
    end else begin
      Returned := 0;
    end;
    Result := Assigned(prc);
  end else begin
    Result := false;
  end;
end;

class function TJSGlobalFunctions.sys_callDll(Dll: String; const Name: String; HasResult: Boolean;
  paramCount: Integer; const p0, p1, p2, p3, p4, p5, p6, p7, p8, p9: Cardinal): Cardinal;
begin
  case paramCount of
    0: DynamicDllCallName(Dll, Name, HasResult, Result, []);
    1: DynamicDllCallName(Dll, Name, HasResult, Result, [Pointer(p0)]);
    2: DynamicDllCallName(Dll, Name, HasResult, Result, [Pointer(p0), Pointer(p1)]);
    3: DynamicDllCallName(Dll, Name, HasResult, Result, [Pointer(p0), Pointer(p1), Pointer(p2)]);
    4: DynamicDllCallName(Dll, Name, HasResult, Result, [Pointer(p0), Pointer(p1), Pointer(p2), Pointer(p3)]);
    5: DynamicDllCallName(Dll, Name, HasResult, Result, [Pointer(p0), Pointer(p1), Pointer(p2), Pointer(p3), Pointer(p4)]);
    6: DynamicDllCallName(Dll, Name, HasResult, Result, [Pointer(p0), Pointer(p1), Pointer(p2), Pointer(p3), Pointer(p4), Pointer(p5)]);
    7: DynamicDllCallName(Dll, Name, HasResult, Result, [Pointer(p0), Pointer(p1), Pointer(p2), Pointer(p3), Pointer(p4), Pointer(p5), Pointer(p6)]);
    8: DynamicDllCallName(Dll, Name, HasResult, Result, [Pointer(p0), Pointer(p1), Pointer(p2), Pointer(p3), Pointer(p4), Pointer(p5), Pointer(p6), Pointer(p7)]);
    9: DynamicDllCallName(Dll, Name, HasResult, Result, [Pointer(p0), Pointer(p1), Pointer(p2), Pointer(p3), Pointer(p4), Pointer(p5), Pointer(p6), Pointer(p7), Pointer(p8)]);
    10: DynamicDllCallName(Dll, Name, HasResult, Result, [Pointer(p0), Pointer(p1), Pointer(p2), Pointer(p3), Pointer(p4), Pointer(p5), Pointer(p6), Pointer(p7), Pointer(p8), Pointer(p9)]);
  end;
  //ShowMessage(intToStr(p1));
//  DynamicDllCallName(Dll, Name, HasResult, Result, [Pointer(p0)]);
end;

class function TJSGlobalFunctions.createMainForm(): TForm;
begin
  Application.CreateForm(TForm, Result);
end;

class function TJSGlobalFunctions.sys_getSysColor(sysColor: Integer): Cardinal;
begin
  Result := GetSysColor(sysColor);
end;

class function TJSGlobalFunctions.sys_showScrollBar(hWnd: HWND; wBar: Integer; bShow: BOOL): BOOL;
begin
  Result := ShowScrollBar(hWnd, wBar, bShow);
end;

class function TJSGlobalFunctions.evalFile(code, filename: string): Boolean;
begin
  Result := FJSEngine.Evaluate(code, filename);
end;

class function TJSGlobalFunctions.getCursorPosition(): TPoint;
begin
   GetCursorPos(Result);
end;

class procedure TJSGlobalFunctions.alert(s: string);
begin
   ShowMessage(s);
end;

class function TJSGlobalFunctions.shellExec(h: HWND; op, fn, p, dir: string; sc: Integer): NativeUInt;
begin
  Result := ShellExecute(h, PChar(op), PChar(fn), PChar(p), PChar(dir), sc);
end;

class function TJSGlobalFunctions.sendMsg(hWnd: HWND; Msg: UINT; wParam: WPARAM; lParam: LPARAM): LRESULT;
begin
   SendMessage(hWnd, Msg, wParam, lParam);
end;

class procedure TJSGlobalFunctions.delay(d: Cardinal);
begin
   Sleep(d);
end;

class function TJSGlobalFunctions.sys_cwd(): String;
begin
  Result:= ExtractFilePath(Application.ExeName);
end;

class function TJSGlobalFunctions.sys_charToString(ch: Char): String;
begin
  Result := ch;
end;

class function TJSGlobalFunctions.sys_stringToChar(str: String): Char;
begin
  Result := str[1];
end;

class function TJSGlobalFunctions.sys_charToCode(ch: Char): Integer;
begin
  Result := Ord(ch);
end;

class function TJSGlobalFunctions.sys_codeToChar(code: Integer): Char;
begin
  Result := Chr(code);
end;

class procedure TJSGlobalFunctions.sys_listBoxSetSelected(ListBox: TListBox; id: Integer; selected: Boolean);
begin
  ListBox.Selected[id] := selected;
end;


class procedure TJSGlobalFunctions.PaintText(Pos, Length: Integer; Color: Cardinal);
begin

end;

procedure Init();
begin
  FJSEngine := TJSEngine.Create(1024*1024*1024);
  FJSEngine.registerClasses([
    To2Canvas,
    To2Sprite,
    To2FrameList,
    To2FrameLine,
    To2TexturePack,
    To2TextureStorage,
      TTimer,
      THintWindow,
      TStreamWriter,
      TFileStream,

      // GUI:
        // menus:
          TMainMenu,
          TMenuItem,
          TPopupMenu,
        TForm,
        TEdit,
        TLabel,
        TMemo,
        TButton,
        TBitBtn,
        TCheckBox,
        TRadioButton,
        TListBox,
        TComboBox,
        TScrollBar,
        TRadioGroup,
        TGroupBox,
        TPanel,
        TScrollBox,
        TImage,
        TRichEdit,
        TTrackBar,
        TProgressBar,
        TTreeView,

      // Dialogs:
      TOpenDialog,
      TSaveDialog,
      TFontDialog,
      TColorDialog,
      TPrintDialog,

      // filesystem
      sys_fs,
      hw
    ], [cfaInheritedMethods,     // Publish inherited methods
        cfaProtectedMethods,     // publish protected methods
        cfaProtectedFields,
        cfaInheritedProperties,  // Publish inherited properties
        cfaOwnObject,            // Free object on javascript destructor
        cfaGlobalFields,         // Register Private fields as properties to global object
        cfaGlobalProperties]);

  FJSEngine.Evaluate('var delphiGlobal = Object.keys(this); var global = this;');
  FJSEngine.Evaluate('var jsInitStart = new Date();');
  FJSEngine.registerGlobalFunctions(TJSGlobalFunctions);
  TJSClass.CreateJSObject(Application, FJSEngine, 'nativeApp', [cfaInheritedMethods, cfaInheritedProperties]);
  TJSClass.CreateJSObject(Screen, FJSEngine, 'screen', [cfaInheritedMethods, cfaInheritedProperties]);
  FJSEngine.EvaluateFile('.\sysjs\init.js');
  FJSEngine.EvaluateFile('.\sysjs\delphiSystem.js');
  FJSEngine.EvaluateFile('.\sysjs\delphiClasses.js');
  FJSEngine.EvaluateFile('.\sysjs\util.js');
  FJSEngine.EvaluateFile('.\sysjs\path.js');
  FJSEngine.EvaluateFile('.\sysjs\os.js');
  FJSEngine.EvaluateFile('.\sysjs\eventEmitter.js');
  FJSEngine.EvaluateFile('.\sysjs\fs.js');
  FJSEngine.EvaluateFile('.\sysjs\timers.js');
  FJSEngine.EvaluateFile('.\sysjs\require.js');
  FJSEngine.EvaluateFile('.\sysjs\ready.js');
  FJSEngine.EvaluateFile('.\app.js');

end;


begin

//f := TForm.Create(nil);
//Application.Initialize();

//Application.CreateForm(TForm, f);
Init();
//Application.Run();
//f.ShowModal();
end.

