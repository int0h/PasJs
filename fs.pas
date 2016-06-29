unit fs;

interface

uses
  Winapi.Windows, System.SysUtils;

type
  sys_fs = class
    public
      function accessSync(filename: string; mode: integer): boolean;
      procedure writeFile(filename, data: string);
      function readFile(filename: string): string;
  end;

implementation

  function sys_fs.accessSync(filename: string; mode: integer): boolean;
    var
      aFile: TextFile;
  begin
    if not FileExists(filename) and not DirectoryExists(filename) then
     begin
       Result := true;
       Exit();
    end;
    Result := false;
  end;

  procedure sys_fs.writeFile(filename, data: string);
    var
      aFile: TextFile;
  begin
     AssignFile(aFile, filename);
     ReWrite(aFile);
     Write(aFile, data);
     CloseFile(aFile);
  end;

  function sys_fs.readFile(filename: string): string;
    var
      aFile: TextFile;
      text, buf: String;
  begin
     text := '';
     if not FileExists(filename) then
     begin
       Result := '';
       Exit();
     end;
     AssignFile(aFile, filename);
     Reset(aFile);
     while not Eof(aFile) do
     begin
       Readln(aFile, buf);
       text := text + buf + #13#10;
     end;
     CloseFile(aFile);
     Result := text;
  end;

end.
