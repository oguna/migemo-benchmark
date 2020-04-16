echo jsmigemo
$a = "node migemo/jsmigemo-cli.js -d dict/migemo-compact-dict -w kensaku"
(Measure-Command {invoke-expression $a | Out-Null}).TotalMilliseconds

echo jmigemo
$a = "java -jar migemo/jmigemo-cli.jar -d dict/migemo-compact-dict -w kensaku"
(Measure-Command {invoke-expression $a | Out-Null}).TotalMilliseconds

echo gomigemo
$a = "migemo/gomigemo.exe -d dict/migemo-compact-dict -w kensaku"
(Measure-Command {invoke-expression $a | Out-Null}).TotalMilliseconds

echo rustmigemo
$a = "migemo/rustmigemo.exe -d dict/migemo-compact-dict -w kensaku"
(Measure-Command {invoke-expression $a | Out-Null}).TotalMilliseconds

echo cmigemo
$a = "migemo/cmigemo/cmigemo.exe -w kensaku"
(Measure-Command {invoke-expression $a | Out-Null}).TotalMilliseconds

echo rustmigemo-wasm
$a = "node .\migemo\rustmigemo-wasm-cli.js -d dict/migemo-compact-dict -w kensaku"
(Measure-Command {invoke-expression $a | Out-Null}).TotalMilliseconds

echo pymigemo
cd migemo
$a = "python -m pymigemo -w kensaku"
(Measure-Command {invoke-expression $a | Out-Null}).TotalMilliseconds
cd ..

echo csmigemo
(Measure-Command {"" | migemo/csmigemo/CsMigemo | Out-Null}).TotalMilliseconds