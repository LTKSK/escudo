# escudo

ts の型定義から自動で型の絞り込みを行うタイプガード関数を生成する

# TODO

- [x] ts の compilerAPI の環境構築する
- [x] compilerAPI について学ぶ
  - [document](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API)
  - [ ] ast を覚える
  - [x] compilerAPI を使って `console.log("Hello world!")` をファイルに出力する
- [x] name と age を持つ User 型の判定を行う isUser のコードを ast から生成できるようにする
- [ ] name と age を持つ type User 型を parse するコードを書く
  - interface は一旦後回し
  - parse した結果、型の名前と型情報を取得する
- [ ] User[]型を持つ Group 型の型ガードを行う関数 isGroup 関数を生成できるようにする

# 参考

- https://ts-ast-viewer.com/#
- https://tech.mobilefactory.jp/entry/2021/12/10/000000

# memo

- type の型定義は `TypeAliasDeclaration`
- createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)で、引数の型を定義できる
