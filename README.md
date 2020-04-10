# migemo-benchmark

| | C/Migemo | gomigemo | rustmigemo | jsmigemo | jmigemo | rustmigemo-wasm |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 言語 | C | Go | Rust | TypeScript | Java | Rust→WASM |
| ランタイム | Native | Native | Native | Node.js | JVM | Node.js |
| 実行ファイルサイズ (KB) | **72** | 2001 | 358 | N/A | N/A | N/A |
| 辞書ファイルサイズ (MB) | 4.78 | **2.03** | **2.03** | **2.03** | **2.03** | **2.03** |
| メモリ使用量 (BM) | 26.1 | 10.9 | **7.7** | 14.7 | 15.5 | 14.4 |
| 起動時間 (ms) | 198 | 109 | **65** | 162 | 234 | 150 |
| クエリ時間 (ms) | **5053** | 13429 | 14939 | 57261 | 15892 | 14618 |

※ 実行ファイルサイズのN/Aは、プログラムの実行にはランタイムが必要であり、比較の対象としていないことを示します。

## 実行環境

### ハードウェア

| | My Laptop |
| ---- | ---- |
| PC | Lenovo ThinkPad X1Carbon 6th (2018) |
| CPU | Intel Core i7-8550U CPU @ 1.80GHz |
| Mem | 16GB |
| OS | Microsoft Windows 10 Home |

### バージョン

```
# java
openjdk version "14" 2020-03-17
OpenJDK Runtime Environment (build 14+36-1461)
OpenJDK 64-Bit Server VM (build 14+36-1461, mixed mode, sharing)
# rust
rustc 1.42.0 (b8cedc004 2020-03-09)
# node
v12.16.1
# go
go version go1.14 windows/amd64
# windows
Microsoft Windows 10 Home
10.0.19041
```

## ベンチマークの設定

### メモリ使用量

メモリ使用量は、プログラムを起動しクエリ入力の待機状態になったときのメモリを、
タスクマネージャから確認したものです。
実際に大量のクエリを処理するときは、より多くのメモリを使用します。

### 起動時間

起動時間には下記の動作を含みます。

- プログラムの起動
- 辞書ファイルの読み込み
- 「kensaku」のクエリを実行
- プログラムの終了

C/Migemoで起動時間を計測するには、下記のコマンドをPowerShell上で実行します。

```powershell
(Measure-Command { migemo/cmigemo/cmigemo.exe -w kensaku | Out-Null}).TotalMilliseconds
```

### クエリ時間

検索時間は、大量のローマ字で表記された単語を入力し、
そのすべてのクエリが完了するまでの時間です。

単語のリストは、新潮文庫の発行部数10位以内のうち、青空文庫で公開され著作権が切れている作品のルビから抽出しています。

具体的には下記の作品です。
- 夏目漱石『こころ』
- 太宰治『人間失格』
- 夏目漱石『坊っちゃん』
- 島崎藤村『破戒』
- 太宰治『斜陽』

ルビは二重山括弧（`《 》`）で囲まれており、この間のひらがなを正規表現で抽出しています。
抽出されたルビをローマ字に変換します。
例えば『こころ』の冒頭一文を挙げると、下記のようになります。

```
私《わたくし》はその人を常に先生と呼んでいた。
↓ ルビを抽出
わたくし
↓ ローマ字に変換
watakusi
```

`main.js`を実行することで、ルビを抽出できます。

```powershell
node main.js
```

それぞれの作品から抽出した単語を連結し、15473個の単語を入力とします。

C/Migemoでクエリ時間を計測するには、下記のコマンドをPowerShell上で実行します。

```powershell
(Measure-Command {cat dataset/all_ruby.txt | migemo/cmigemo/cmigemo.exe -q | Out-Null}).TotalMilliseconds
```

### 辞書ファイル

辞書ファイルは、C/Migemoの配布パッケージに含まれている`migemo-dict`と、
`migemo-dict`から収録単語数などは削減せずに変換した`migemo-compact-dict`を使用しています。

## 考察

WIP