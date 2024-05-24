import { AST_NODE_TYPES } from '@typescript-eslint/types'
import { TSESTree } from '@typescript-eslint/utils'
import { ReportDescriptor, RuleContext } from '@typescript-eslint/utils/dist/ts-eslint'

import { ArrayUtils } from '../utils/array'
import { ComparerUtils } from '../utils/comparer'
import { ConfigUtils } from '../utils/config'
import { createRule } from '../utils/createRule'
import { FixUtils } from '../utils/fix'

type Options = []

// Define the message ID for unsorted keys
export const HAS_UNSORTED_KEYS_MESSAGE_ID = 'hasUnsortedKeys'

// Define the type for the message IDs
type MessageIds = typeof HAS_UNSORTED_KEYS_MESSAGE_ID

// Function to get config from the parent node
const getParentNodeConfig = (
  node: TSESTree.Node,
  parentTypes: AST_NODE_TYPES[],
  deepCountingTypes: AST_NODE_TYPES[],
  sourceCode: any,
) => {
  let currentNode: TSESTree.Node = node
  let deepLevel = 1
  while ((currentNode = currentNode.parent) !== null) {
    if (deepCountingTypes.includes(currentNode.type)) {
      deepLevel += 1
    }
    if (parentTypes.includes(currentNode.type)) {
      const commentExpectedEndLine = currentNode.loc.start.line - 1
      const config = ConfigUtils.getConfig(sourceCode, '@sort-keys', commentExpectedEndLine)
      if (config.deepLevel < deepLevel) {
        return null
      }

      return { config, deepLevel }
    }
  }
  return null
}

// Function to get config from the current node
const getCurrentNodeConfig = (node: TSESTree.Node, sourceCode: any) => {
  const commentExpectedEndLine = node.loc.start.line - 1
  const config = ConfigUtils.getConfig(sourceCode, '@sort-keys', commentExpectedEndLine)
  return { config }
}

// Check if the properties of a node need sorting and report if necessary.
const checkAndReport = <N extends TSESTree.Node>(
  node: N,
  comparer: (a: TSESTree.Node, b: TSESTree.Node) => number,
  getProperties: (node: N) => TSESTree.Node[],
  sourceCode: any,
  report: (descriptor: ReportDescriptor<'hasUnsortedKeys'>) => void,
) => {
  const properties = getProperties(node)
  const sortedProperties = [...properties].sort(comparer)

  const needSort = ArrayUtils.zip2(properties, sortedProperties).some(
    ([property, sortedProperty]) => property !== sortedProperty,
  )

  if (needSort) {
    const diffRanges = ArrayUtils.zip2(properties, sortedProperties).map(([from, to]) => ({
      from: from.range,
      to: to.range,
    }))

    const fixedText = FixUtils.getFixedText(sourceCode, node.range, diffRanges)

    report({
      node,
      messageId: HAS_UNSORTED_KEYS_MESSAGE_ID,
      fix(fixer) {
        return fixer.replaceTextRange(node.range, fixedText)
      },
    })
  }
}

// Create the rule for sorting keys based on the @sort-keys annotation
export default createRule<Options, MessageIds>({
  name: 'sort-keys-annotation',
  meta: {
    docs: {
      description: 'Sort keys in object if annotated as @sort-keys',
      recommended: 'error',
      suggestion: true,
    },
    fixable: 'code',
    type: 'suggestion',
    schema: [],
    messages: {
      [HAS_UNSORTED_KEYS_MESSAGE_ID]: `has unsorted keys`,
    },
  },
  defaultOptions: [],
  create(context) {
    const sourceCode = context.getSourceCode()

    return {
      // Handle object expressions (e.g., object literals)
      ObjectExpression(node): void {
        const result = getParentNodeConfig(
          node,
          [AST_NODE_TYPES.VariableDeclaration, AST_NODE_TYPES.TSTypeAliasDeclaration],
          [AST_NODE_TYPES.ObjectExpression],
          sourceCode,
        )
        if (!result || !result.config) {
          return
        }

        const { config, deepLevel } = result
        const { isReversed } = config
        const comparer = ComparerUtils.makeObjectPropertyComparer({ isReversed })

        checkAndReport(node, comparer, (node) => node.properties, sourceCode, context.report)
      },
      // Handle TypeScript interface bodies
      TSInterfaceBody(node): void {
        const result = getParentNodeConfig(
          node,
          [AST_NODE_TYPES.TSInterfaceDeclaration],
          [AST_NODE_TYPES.TSInterfaceBody],
          sourceCode,
        )
        if (!result || !result.config) {
          return
        }

        const { config, deepLevel } = result
        const { isReversed } = config
        const comparer = ComparerUtils.makeInterfacePropertyComparer({ isReversed })

        checkAndReport(node, comparer, (node) => node.body, sourceCode, context.report)
      },
      // Handle TypeScript type literals
      TSTypeLiteral(node): void {
        const result = getParentNodeConfig(
          node,
          [AST_NODE_TYPES.TSInterfaceDeclaration, AST_NODE_TYPES.TSTypeAliasDeclaration],
          [AST_NODE_TYPES.TSInterfaceBody, AST_NODE_TYPES.TSTypeLiteral],
          sourceCode,
        )
        if (!result || !result.config) {
          return
        }

        const { config, deepLevel } = result
        const { isReversed } = config
        const comparer = ComparerUtils.makeInterfacePropertyComparer({ isReversed })

        checkAndReport(node, comparer, (node) => node.members, sourceCode, context.report)
      },
      // Handle TypeScript enum declarations
      TSEnumDeclaration(node): void {
        const { config } = getCurrentNodeConfig(node, sourceCode)
        if (!config) {
          return
        }

        const { isReversed } = config
        const comparer = ComparerUtils.makeEnumMemberComparer({ isReversed })

        checkAndReport(node, comparer, (node) => node.members, sourceCode, context.report)
      },
    }
  },
})
