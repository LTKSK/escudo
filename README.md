# escudo

tsの型定義から自動で型の絞り込みを行うタイプガード関数を生成する

# TODO

- [x] tsのcompilerAPIの環境構築する
- [x] compilerAPIについて学ぶ
  - [document](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API)
  - [ ] astを覚える
  - [x] compilerAPIを使って `console.log("Hello world!")` をファイルに出力する
- [ ] nameとageを持つUser型の判定を行うisUserのコードをastから生成できるようにする
- [ ] nameとageを持つtype User型をparseするコードを書く
  - interfaceは一旦後回し
  - parseした結果、型の名前
- [ ] User[]型を持つGroup型の型ガードを行う関数isGroup関数を生成できるようにする

# 参考

- https://ts-ast-viewer.com/#
- https://tech.mobilefactory.jp/entry/2021/12/10/000000

# memo

- typeの型定義は `TypeAliasDeclaration`
- createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)で、引数の型を定義できる


