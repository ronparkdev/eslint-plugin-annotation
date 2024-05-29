import path from 'path'

import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils'

const { RuleTester } = ESLintUtils

import rule from '../src/rules/unique'

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

ruleTester.run('unique', rule, {
  valid: [
    {
      code: `
      // @unique
      const ids = [1, 2, 3, 4, 5];
      `,
      filename: getFilename('main.ts'),
    },
    {
      code: `
      // @unique
      const names = ["Alice", "Bob", "Charlie"];
      `,
      filename: getFilename('main.ts'),
    },
    {
      code: `
      // @unique
      const mixed = [1, "2", null, true, false];
      `,
      filename: getFilename('main.ts'),
    },
    {
      code: `
      // @unique
      const sparseArray = [1, 2, , 3];
      `,
      filename: getFilename('main.ts'),
    },
  ],
  invalid: [
    {
      code: `
      // @unique
      const ids = [1, 2, 2, 4, 5];
      `,
      errors: [{ messageId: 'duplicateValues', type: AST_NODE_TYPES.ArrayExpression }],
      output: `
      // @unique
      const ids = [1, 2, 4, 5];
      `,
      filename: getFilename('main.ts'),
    },
    {
      code: `
      // @unique
      const names = ["Alice", "Bob", "Alice"];
      `,
      errors: [{ messageId: 'duplicateValues', type: AST_NODE_TYPES.ArrayExpression }],
      output: `
      // @unique
      const names = ["Alice", "Bob"];
      `,
      filename: getFilename('main.ts'),
    },
    {
      code: `
      // @unique
      const sparseArray = [1, 2, , 1];
      `,
      errors: [{ messageId: 'duplicateValues', type: AST_NODE_TYPES.ArrayExpression }],
      output: `
      // @unique
      const sparseArray = [1, 2, ];
      `,
      filename: getFilename('main.ts'),
    },
  ],
})
