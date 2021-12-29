import ts from "typescript";
import fs from "fs";
import path from "path";
import { extractTypeAliasDeclaration, TypeAliasDeclaration } from "./parser";

function makeValidater(
  srcFileName: string,
  targetTypeName: string,
  attributes: TypeAliasDeclaration["attributes"]
) {
  // import定義
  const importDeclaration = ts.factory.createImportDeclaration(
    undefined,
    undefined,
    ts.factory.createImportClause(
      false,
      undefined,
      ts.factory.createNamedImports([
        ts.factory.createImportSpecifier(
          true,
          undefined,
          ts.factory.createIdentifier(targetTypeName)
        ),
      ])
    ),
    ts.factory.createStringLiteral(`./${srcFileName}`),
    undefined
  );

  //関数定義
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
    ts.SyntaxKind.EqualsEqualsEqualsToken,
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
        ts.factory.createStringLiteral(type.name)
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
  const functionDecralation = ts.factory.createFunctionDeclaration(
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

  return ts.factory.createSourceFile(
    [importDeclaration, functionDecralation],
    ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
    ts.NodeFlags.None
  );
}

const resultFile = ts.createSourceFile(
  "",
  "",
  ts.ScriptTarget.Latest,
  /*setParentNodes*/ false,
  ts.ScriptKind.TS
);

// 引数に渡したpathのファイルを解析する
const targetFilePath = path.resolve(process.argv[2]);
const targetFileDir = path.dirname(targetFilePath);
const targetExt = path.extname(targetFilePath);
// 対象のファイルの拡張子以外を取得
const targetFileName = path.basename(targetFilePath).replace(targetExt, "");
const outputFileName = `${targetFileName}.validators.ts`;
const outputPath = path.join(targetFileDir, outputFileName);

const decralations = extractTypeAliasDeclaration(targetFilePath);

const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
const result = decralations.reduce((prev, dec) => {
  const result = printer.printNode(
    ts.EmitHint.Unspecified,
    makeValidater(targetFileName, dec.typeName, dec.attributes),
    resultFile
  );
  if (prev === "") return result;
  return prev + `\n\n` + result;
}, "");

console.log(result);

const typeFile = fs.openSync(outputPath, "w+");
fs.writeFileSync(typeFile, result);
