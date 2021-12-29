import ts from "typescript";

type TypeAliasDeclaration = {
  typeName: string;
  attributes: {
    name: string;
    type: string;
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

          // literalだったらここでpush
          const type = ts.tokenToString(m.type.kind);
          if (ts.isIdentifier(m.name) && type) {
            attributes.push({
              name: String(m.name.escapedText),
              type,
            });
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
