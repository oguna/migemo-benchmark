echo jsmigemo
#$a = "node migemo/jsmigemo-cli.js -d dict/migemo-compact-dict -q"
(Measure-Command {cat dataset/all_ruby.txt | node migemo/jsmigemo-cli.js -d dict/migemo-compact-dict -q | Out-Null}).TotalMilliseconds

echo jmigemo
#$a = "java -jar migemo/jmigemo.jar -q"
(Measure-Command {cat dataset/all_ruby.txt | java -jar migemo/jmigemo-cli.jar -d dict/migemo-compact-dict -q | Out-Null}).TotalMilliseconds

echo gomigemo
#$a = "migemo/gomigemo.exe -d dict/migemo-compact-dict -q"
(Measure-Command {cat dataset/all_ruby.txt | migemo/gomigemo.exe -d dict/migemo-compact-dict -q | Out-Null}).TotalMilliseconds

echo rustmigemo
#$a = "migemo/rustmigemo.exe -d dict/migemo-compact-dict -q"
(Measure-Command {cat dataset/all_ruby.txt | migemo/rustmigemo.exe -d dict/migemo-compact-dict -q | Out-Null}).TotalMilliseconds

echo cmigemo
#$a = "migemo/cmigemo/cmigemo.exe -q"
(Measure-Command {cat dataset/all_ruby.txt | migemo/cmigemo/cmigemo.exe -q | Out-Null}).TotalMilliseconds

echo rustmigemo-wasm
#$a = "node .\migemo\rustmigemo-wasm-cli.js -d dict/migemo-compact-dict -q"
(Measure-Command {cat dataset/all_ruby.txt | node .\migemo\rustmigemo-wasm-cli.js -d dict/migemo-compact-dict -q | Out-Null}).TotalMilliseconds