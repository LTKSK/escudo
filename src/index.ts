import ts from "typescript";

function astFactory(message: string) {
  return [
    ts.createExpressionStatement(
      ts.createCall(
        ts.createPropertyAccess(
          ts.createIdentifier("console"),
          ts.createIdentifier("log")
        ),
        undefined,
        [ts.createStringLiteral(message)]
      )
    ),
  ];
}

const printer = ts.createPrinter();

function main(message: string) {
  const print = printer.printList(
    ts.ListFormat.MultiLine,
    ts.createNodeArray(astFactory(message)),
    ts.createSourceFile("", "", ts.ScriptTarget.ES2021)
  );
  console.log(print);
}

main(process.argv[2].slice(0));
