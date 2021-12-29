import ts from "typescript";

/**
 * Prints out particular nodes from a source file
 *
 * @param file a path to a file
 * @param identifiers top level identifiers available
 */
function extract(file: string, identifiers: string[]): void {
  // Create a Program to represent the project, then pull out the
  // source file to parse its AST.
  const program = ts.createProgram([file], { allowJs: true });
  const sourceFile = program.getSourceFile(file);
  if (!sourceFile) return;

  ts.forEachChild(sourceFile, (node) => {
    if (ts.isTypeAliasDeclaration(node)) {
      node.forEachChild((child) => {
        if (ts.isTypeLiteralNode(child)) {
          //console.log({ members: child.members });
          child.members.forEach((m) => {
            if (ts.isPropertySignature(m)) {
              console.log({
                name: ts.isIdentifier(m.name) ? m.name.escapedText : "none",
                type: m.type ? ts.tokenToString(m.type.kind) : "none type",
              });
            }
          });
        }
      });
    }
  });
}

// Run the extract function with the script's arguments
extract(process.argv[2], process.argv.slice(3));
