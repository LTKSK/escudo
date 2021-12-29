import ts from "typescript";
import { extractTypeAliasDeclaration } from "./parser";

function makeValidate(
  targetTypeName: string,
  attributes: { name: string; type: string }[]
): ts.FunctionDeclaration {
  const functionName = ts.factory.createIdentifier(`is${targetTypeName}`);
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

  const asserts = attributes.map(({ name, type }) =>
    ts.factory.createIfStatement(
      ts.factory.createBinaryExpression(
        ts.factory.createTypeOfExpression(
          ts.factory.createPropertyAccessExpression(
            ts.factory.createParenthesizedExpression(
              ts.factory.createAsExpression(
                paramName,
                ts.factory.createTypeReferenceNode(targetTypeName, undefined)
              )
            ),
            name
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
      ts.factory.createTypeReferenceNode(targetTypeName, undefined)
    ),
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

// 引数に渡したpathのファイルを解析する
const decralations = extractTypeAliasDeclaration(process.argv[2]);

const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

decralations.forEach((dec) => {
  const result = printer.printNode(
    ts.EmitHint.Unspecified,
    makeValidate(dec.typeName, dec.attributes),
    resultFile
  );
  console.log(result);
});
