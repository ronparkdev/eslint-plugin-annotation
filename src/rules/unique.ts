import { createRule } from '../utils/createRule'
import { ConfigUtils } from '../utils/config'

type Options = []

export const DUPLICATE_VALUES_MESSAGE_ID = 'duplicateValues'

type MessageIds = typeof DUPLICATE_VALUES_MESSAGE_ID

export default createRule<Options, MessageIds>({
  name: 'unique',
  meta: {
    docs: {
      description: 'Ensure array values are unique if annotated with @unique',
      recommended: 'error',
      suggestion: false,
    },
    fixable: 'code',
    type: 'problem',
    schema: [],
    messages: {
      [DUPLICATE_VALUES_MESSAGE_ID]: 'Array contains duplicate values.',
    },
  },
  defaultOptions: [],
  create(context) {
    const sourceCode = context.getSourceCode()

    return {
      ArrayExpression(node) {
        const commentExpectedEndLine = node.loc.start.line - 1
        const config = ConfigUtils.getConfig(sourceCode, '@unique', commentExpectedEndLine)

        if (!config) {
          return
        }

        const elements = node.elements
        const uniqueElements = Array.from(new Set(elements.map((element) => sourceCode.getText(element))))

        if (elements.length !== uniqueElements.length) {
          context.report({
            node,
            messageId: DUPLICATE_VALUES_MESSAGE_ID,
            fix(fixer) {
              const fixedArray = uniqueElements.join(', ')
              return fixer.replaceText(node, `[${fixedArray}]`)
            },
          })
        }
      },
    }
  },
})
