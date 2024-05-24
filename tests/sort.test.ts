import path from 'path'

import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils'

const { RuleTester } = ESLintUtils

import rule, { HAS_UNSORTED_KEYS_MESSAGE_ID } from '../src/rules/sort'

const getFilename = (filePath: string): string => path.resolve('./tests', filePath)

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2015,
    project: getFilename('tsconfig.json'),
    sourceType: 'module',
  },
})

ruleTester.run('sort', rule, {
  valid: [
    {
      code: `
      const A = 'A'
      const B = 'B'
      enum Type {
        A = 'A',
        B = 'B',
      }
      // @sort
      const array = [false, true, 1, 2, 11, 12, 1n, 2n, 11n, 12n, '1', '11', '2', '22', 'a', 'b', A, B, Type.A, Type.B]
      `,
      filename: getFilename('main.ts'),
    },
    {
      code: `
      const A = 'A'
      const B = 'B'
      const C = 'C'
      enum Type {
        A = 'A',
        B = 'B',
        C = 'C',
      }
      // @sort:reversed
      const reversedArray = [Type.B, Type.A, B, A, 'b', 'a', '22', '2', '11', '1', 12n, 11n, 2n, 1n, 12, 11, 2, 1, true, false]    
      `,
      filename: getFilename('main.ts'),
    },
    {
      code: `
      /*
        @sort
      */
        const simpleArray = [1, 2]
      `,
      filename: getFilename('main.ts'),
    },
    {
      code: `
      /*
        @sort:reversed
      */
        const reversedSimpleArray = [2, 1]
      `,
      filename: getFilename('main.ts'),
    },
  ],
  invalid: [
    {
      code: `
      const A = 'A'
      const B = 'B'
      enum Type {
        A = 'A',
        B = 'B',
      }
      // @sort
      const array = [Type.B, Type.A, B, A, 'b', 'a', '22', '2', '11', '1', 12n, 11n, 2n, 1n, 12, 11, 2, 1, true, false]
      `,
      errors: [{ messageId: HAS_UNSORTED_KEYS_MESSAGE_ID, type: AST_NODE_TYPES.ArrayExpression }],
      output: `
      const A = 'A'
      const B = 'B'
      enum Type {
        A = 'A',
        B = 'B',
      }
      // @sort
      const array = [false, true, 1, 2, 11, 12, 1n, 2n, 11n, 12n, '1', '11', '2', '22', 'a', 'b', A, B, Type.A, Type.B]
      `,
      filename: getFilename('main.ts'),
    },
    {
      code: `
      const A = 'A'
      const B = 'B'
      // @sort:reversed
      const reversedArray = [false, true, 1, 2, 11, 12, 1n, 2n, 11n, 12n, '1', '11', '2', '22', 'a', 'b', A, B, Type.A, Type.B]
      `,
      errors: [{ messageId: HAS_UNSORTED_KEYS_MESSAGE_ID, type: AST_NODE_TYPES.ArrayExpression }],
      output: `
      const A = 'A'
      const B = 'B'
      // @sort:reversed
      const reversedArray = [Type.B, Type.A, B, A, 'b', 'a', '22', '2', '11', '1', 12n, 11n, 2n, 1n, 12, 11, 2, 1, true, false]
      `,
      filename: getFilename('main.ts'),
    },
    {
      code: `
      /*
        @sort
      */
      const simpleArray = [2, 1]
      `,
      errors: [{ messageId: HAS_UNSORTED_KEYS_MESSAGE_ID, type: AST_NODE_TYPES.ArrayExpression }],
      output: `
      /*
        @sort
      */
      const simpleArray = [1, 2]
      `,
      filename: getFilename('main.ts'),
    },
    {
      code: `
      /*
        @sort:reversed
      */
      const reversedSimpleArray = [1, 2]
      `,
      errors: [{ messageId: HAS_UNSORTED_KEYS_MESSAGE_ID, type: AST_NODE_TYPES.ArrayExpression }],
      output: `
      /*
        @sort:reversed
      */
      const reversedSimpleArray = [2, 1]
      `,
      filename: getFilename('main.ts'),
    },
  ],
})
