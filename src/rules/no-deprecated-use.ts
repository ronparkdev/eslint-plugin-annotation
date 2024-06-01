import { TSESTree } from '@typescript-eslint/utils'
import ts from 'typescript'
import { createRule } from '../utils/createRule'

type Options = []

export const NO_DEPRECATED_USE_MESSAGE_ID = 'noDeprecatedUse'

type MessageIds = typeof NO_DEPRECATED_USE_MESSAGE_ID

export default createRule<Options, MessageIds>({
  name: 'no-deprecated-use',
  meta: {
    docs: {
      description: 'Disallow the use of @deprecated functions and variables',
      recommended: 'error',
      suggestion: false,
    },
    type: 'problem',
    schema: [],
    messages: {
      [NO_DEPRECATED_USE_MESSAGE_ID]: 'Usage of deprecated identifier "{{name}}" is not allowed.',
    },
  },
  defaultOptions: [],
  create(context) {
    const deprecatedNodes = new Map<string, TSESTree.Identifier>()
    const sourceCode = context.getSourceCode()
    const services = context.parserServices!
    const program = services.program
    const typeChecker = program.getTypeChecker()

    // Helper function to collect deprecated nodes
    const collectDeprecatedNodes = (node: ts.Node) => {
      if (ts.isJSDoc(node)) {
        const jsDocTags = node.tags
        if (jsDocTags) {
          jsDocTags.forEach((tag) => {
            if (tag.tagName.text === 'deprecated') {
              const parent = node.parent
              if (ts.isFunctionDeclaration(parent) || ts.isVariableDeclaration(parent)) {
                const symbol = typeChecker.getSymbolAtLocation(parent.name)
                if (symbol) {
                  deprecatedNodes.set(symbol.name, parent.name as unknown as TSESTree.Identifier)
                }
              }
            }
          })
        }
      }
      ts.forEachChild(node, collectDeprecatedNodes)
    }

    return {
      Program() {
        const tsNode = services.esTreeNodeToTSNodeMap.get(context.getSourceCode().ast)
        collectDeprecatedNodes(tsNode)
      },
      Identifier(node: TSESTree.Identifier) {
        const symbol = typeChecker.getSymbolAtLocation(services.esTreeNodeToTSNodeMap.get(node))
        if (symbol && deprecatedNodes.has(symbol.name)) {
          context.report({
            node,
            messageId: NO_DEPRECATED_USE_MESSAGE_ID,
            data: {
              name: symbol.name,
            },
          })
        }
      },
    }
  },
})
