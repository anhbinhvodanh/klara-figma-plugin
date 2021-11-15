import ts from 'typescript'

export function filterTypeScriptDiagnostics(
  diagnostics: Array<ts.Diagnostic>
): Array<ts.Diagnostic> {
  return diagnostics.filter(function (diagnostic: ts.Diagnostic): boolean {
    // The `console` global defined in `@figma/plugin-typings` clashes with
    // the `console` global defined by the `dom` and `@types/nodes` libraries.
    // We suppress this specific error when type-checking.
    // See https://github.com/figma/plugin-typings/pull/52/files#diff-7aa4473ede4abd9ec099e87fec67fd57afafaf39e05d493ab4533acc38547eb8

    if (typeof diagnostic.file === 'undefined') {
      return true
    }
    const fileName = diagnostic.file.fileName
    if (
      fileName.indexOf('typescript/lib/lib.dom.d.ts') === -1 &&
      fileName.indexOf('@figma/plugin-typings/index.d.ts') === -1 &&
      fileName.indexOf('@types/node/globals.d.ts') === -1
    ) {
      return true
    }
    const { code, messageText } = diagnostic
    if (
      code === 2451 &&
      messageText !== "Cannot redeclare block-scoped variable 'console'."
    ) {
      return true
    }
    if (
      code === 2649 &&
      messageText !==
        "Cannot augment module 'console' with value exports because it resolves to a non-module entity."
    ) {
      return true
    }
    return false
  })
}
