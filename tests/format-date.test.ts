import path from 'path'

import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils'

const { RuleTester } = ESLintUtils

import rule from '../src/rules/format-date'

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

ruleTester.run('format-date', rule, {
  valid: [
    {
      code: `
      // @format-date(yyyy-MM-dd)
      const date = "2023-05-24";
      `,
      filename: getFilename('main.ts'),
    },
    {
      code: `
      // @format-date(yyyy-MM-dd'T'HH:mm:ss.SSS'Z')
      const date = "2023-05-24T12:34:56.789Z";
      `,
      filename: getFilename('main.ts'),
    },
    {
      code: `
      // @format-date(isostring)
      const date = "2023-05-24T12:34:56.789Z";
      `,
      filename: getFilename('main.ts'),
    },
    {
      code: `
      // @format-date(utcstring)
      const date = "Wed, 14 Jun 2017 07:00:00 GMT";
      `,
      filename: getFilename('main.ts'),
    },
  ],
  invalid: [
    {
      code: `
      // @format-date(yyyy-MM-dd)
      const date = "05/24/2023";
      `,
      errors: [{ messageId: 'hasIncorrectDateFormat', type: AST_NODE_TYPES.Literal }],
      filename: getFilename('main.ts'),
    },
    {
      code: `
      // @format-date(yyyy-MM-dd'T'HH:mm:ss.SSS'Z')
      const date = "2023.05.24 12:34:56.789";
      `,
      errors: [{ messageId: 'hasIncorrectDateFormat', type: AST_NODE_TYPES.Literal }],
      filename: getFilename('main.ts'),
    },
    {
      code: `
      // @format-date(isostring)
      const date = "2023-05-24 12:34:56.789";
      `,
      errors: [{ messageId: 'hasIncorrectDateFormat', type: AST_NODE_TYPES.Literal }],
      filename: getFilename('main.ts'),
    },
    {
      code: `
      // @format-date(utcstring)
      const date = "2023-05-24T12:34:56.789Z";
      `,
      errors: [{ messageId: 'hasIncorrectDateFormat', type: AST_NODE_TYPES.Literal }],
      filename: getFilename('main.ts'),
    },
  ],
})
