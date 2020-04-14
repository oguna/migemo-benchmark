echo "# java"
java -version
echo "# rust"
rustc --version
echo "# node"
node --version
echo "# go"
go version
echo "# python"
python --version
echo "# windows"
(Get-WmiObject Win32_OperatingSystem).Caption
(Get-WmiObject Win32_OperatingSystem).Version