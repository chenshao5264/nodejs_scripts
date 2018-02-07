set src=E:\richMan_client\res\
set dst=F:\code\nodejs\json-compress\src\
set dst_out=F:\code\nodejs\json-compress\out\

xcopy /s/y/i/f "%src%\*.json" "%dst%"
xcopy /s/y/i/f "%src%\*.json" "%dst_out%"

pause