import path from 'path'

import { ESLintUtils } from '@typescript-eslint/utils'

const { RuleTester } = ESLintUtils

import rule from '../src/rules/no-deprecated-use'

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

ruleTester.run('no-deprecated-use', rule, {
  valid: [
    {
      code: `
        // @deprecated
        const oldVar = 1;
        const newVar = oldVar; // no error
      `,
    },
  ],
  invalid: [
    {
      code: `
        // @deprecated
        const oldVar = 1;
        const useOldVar = oldVar; // error
      `,
      errors: [{ messageId: 'noDeprecatedIdentifiers' }],
    },
  ],
})
