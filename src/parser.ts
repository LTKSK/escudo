import ts from "typescript";

export type TypeAliasDeclaration = {
  typeName: string;
  attributes: {
    name: string;
    type: { kind: "primitive"; name: string } | { kind: "array"; name: string };
  }[];
};

export function extractTypeAliasDeclaration(
  file: string
): TypeAliasDeclaration[] {
  // Create a Program to represent the project, then pull out the
  // source file to parse its AST.
  const program = ts.createProgram([file], { allowJs: true });
  const sourceFile = program.getSourceFile(file);
  if (!sourceFile) return [];

  const declarations: TypeAliasDeclaration[] = [];
  ts.forEachChild(sourceFile, (node) => {
    if (ts.isTypeAliasDeclaration(node)) {
      const typeName = String(node.name.escapedText);
      const attributes: TypeAliasDeclaration["attributes"] = [];
      node.forEachChild((child) => {
        if (!ts.isTypeLiteralNode(child)) return;
        child.members.forEach((m) => {
          if (!ts.isPropertySignature(m)) return;
          // type定義がundefinedでも無視
          if (!m.type) return;
          // symbolの型は無視する
          if (m.type.kind === ts.SyntaxKind.SymbolKeyword) return;

          if (ts.isToken(m.type)) {
            // literalだったらここでpush
            const type = ts.tokenToString(m.type.kind);
            if (ts.isIdentifier(m.name) && type) {
              attributes.push({
                name: String(m.name.escapedText),
                type: { kind: "primitive", name: type },
              });
            }
          } else if (ts.isArrayTypeNode(m.type)) {
            if (ts.isToken(m.type.elementType)) {
              console.log(ts.tokenToString(m.type.elementType.kind));
              //   attributes.push({
              //     name: String(m.name.escapedText),
              //     type: { kind: "primitive", name: type },
              //   });
            }
            // TODO tokenじゃない場合は定義済みの型の名前のIdentifierが入っている
          }
          // literal以外は再帰の必要あり
        });
      });

      // TODO: attributesが空だったら無視する
      if (attributes.length > 0) {
        declarations.push({ typeName, attributes });
      }
    }
  });
  return declarations;
}

const decralations = extractTypeAliasDeclaration(process.argv[2]);
console.dir(decralations, { depth: null });
