import { TSESTree } from '@typescript-eslint/utils'
import { isMatch } from 'date-fns'

import { ConfigUtils } from '../utils/config'
import { createRule } from '../utils/createRule'

type Options = []

export const HAS_INCORRECT_DATE_FORMAT_MESSAGE_ID = 'hasIncorrectDateFormat'

type MessageIds = typeof HAS_INCORRECT_DATE_FORMAT_MESSAGE_ID

const PRESERVED_FORMAT_MAP: { [key: string]: string } = {
  isostring: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
  utcstring: "EEE, dd MMM yyyy HH:mm:ss 'GMT'",
}

export default createRule<Options, MessageIds>({
  name: 'format-date',
  meta: {
    docs: {
      description: 'Ensure dates in strings match the specified @format-date annotation',
      recommended: 'error',
      suggestion: false,
    },
    type: 'suggestion',
    schema: [],
    messages: {
      [HAS_INCORRECT_DATE_FORMAT_MESSAGE_ID]: 'Date format does not match the expected format: {{ format }}',
    },
  },
  defaultOptions: [],
  create(context) {
    const sourceCode = context.getSourceCode()

    const checkAndReport = (node: TSESTree.Literal, format: string) => {
      const value = node.value as string

      if (!isMatch(value, format)) {
        context.report({
          node,
          messageId: HAS_INCORRECT_DATE_FORMAT_MESSAGE_ID,
          data: {
            format,
          },
        })
      }
    }

    return {
      Literal(node) {
        if (typeof node.value === 'string') {
          const commentExpectedEndLine = node.loc.start.line - 1
          const config = ConfigUtils.getConfig(sourceCode, '@format-date', commentExpectedEndLine)

          if (config?.value) {
            const format = PRESERVED_FORMAT_MAP[config.value] || config.value
            checkAndReport(node, format)
          }
        }
      },
    }
  },
})
