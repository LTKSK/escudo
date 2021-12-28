import ts from "typescript";

function makeFactorialFunction() {
  const todoIdentifier = "User";
  const functionName = ts.factory.createIdentifier(`is${todoIdentifier}`);
  const paramName = ts.factory.createIdentifier("target");
  const parameter = ts.factory.createParameterDeclaration(
    /*decorators*/ undefined,
    /*modifiers*/ undefined,
    /*dotDotDotToken*/ undefined,
    paramName,
    undefined,
    ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)
  );

  const returnFalseBody = ts.factory.createBlock(
    [ts.factory.createReturnStatement(ts.factory.createFalse())],
    /*multiline*/ false
  );

  // object
  const isObjectCondition = ts.factory.createBinaryExpression(
    ts.factory.createTypeOfExpression(ts.factory.createIdentifier("target")),
    ts.SyntaxKind.ExclamationEqualsEqualsToken,
    ts.factory.createStringLiteral("object")
  );
  const notNullCondition = ts.factory.createBinaryExpression(
    ts.factory.createIdentifier("target"),
    ts.SyntaxKind.ExclamationEqualsEqualsToken,
    ts.factory.createNull()
  );
  // Userの持つnameのhardコーディング
  const todoAttributeAndTypes = [
    ["name", "string"],
    ["age", "number"],
  ];
  const asserts = todoAttributeAndTypes.map(([attribute, type]) =>
    ts.factory.createIfStatement(
      ts.factory.createBinaryExpression(
        ts.factory.createTypeOfExpression(
          ts.factory.createPropertyAccessExpression(
            ts.factory.createParenthesizedExpression(
              ts.factory.createAsExpression(
                paramName,
                ts.factory.createTypeReferenceNode(todoIdentifier, undefined)
              )
            ),
            attribute
          )
        ),
        ts.SyntaxKind.ExclamationEqualsEqualsToken,
        ts.factory.createStringLiteral(type)
      ),
      returnFalseBody
    )
  );

  const condition = ts.factory.createBinaryExpression(
    isObjectCondition,
    ts.SyntaxKind.BarBarToken,
    notNullCondition
  );

  const statements = [
    ts.factory.createIfStatement(condition, returnFalseBody),
    ...asserts,
    ts.factory.createReturnStatement(ts.factory.createTrue()),
  ];

  return ts.factory.createFunctionDeclaration(
    /*decorators*/ undefined,
    /*modifiers*/ [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
    /*asteriskToken*/ undefined,
    functionName,
    /*typeParameters*/ undefined,
    [parameter],
    /*returnType*/
    ts.factory.createTypePredicateNode(
      undefined,
      paramName,
      ts.factory.createTypeReferenceNode(todoIdentifier, undefined)
    ),
    // ts.factory.createKeywordTypeNode( ts.SyntaxKind.NumberKeyword),
    ts.factory.createBlock(statements, /*multiline*/ true)
  );
}

const resultFile = ts.createSourceFile(
  "someFileName.ts",
  "",
  ts.ScriptTarget.Latest,
  /*setParentNodes*/ false,
  ts.ScriptKind.TS
);

const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
const result = printer.printNode(
  ts.EmitHint.Unspecified,
  makeFactorialFunction(),
  resultFile
);
console.log(result);
