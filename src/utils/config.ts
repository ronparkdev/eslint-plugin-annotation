import { AST_TOKEN_TYPES } from '@typescript-eslint/utils'
import { SourceCode } from '@typescript-eslint/utils/dist/ts-eslint'

/**
 * Extracts the configuration from a comment matching the specified annotation.
 * @param sourceCode The source code object.
 * @param annotationName The name of the annotation to look for.
 * @param commentEndLine The line number where the comment ends.
 * @return The extracted configuration or null if not found.
 */
const getConfig = (sourceCode: SourceCode, annotationName: string, commentEndLine: number) => {
  // Find the matching comment
  const matchedComment = sourceCode
    .getAllComments()
    .filter((comment) => [AST_TOKEN_TYPES.Line, AST_TOKEN_TYPES.Block].includes(comment.type))
    .find((comment) => comment.loc.end.line === commentEndLine)

  if (!matchedComment) {
    return null
  }

  // Extract the line containing the annotation
  const matchedCommentLineString = matchedComment.value
    .split('\n')
    .map((lineString) => lineString.trim())
    .find((lineString) => lineString.split(' ').some((str) => str.startsWith(annotationName)))

  if (!matchedCommentLineString) {
    return null
  }

  // Extract options and values from the annotation
  const options = matchedCommentLineString.split(':')
  const value = extractValue(matchedCommentLineString)
  const isReversed = options.includes('reversed')
  const deepLevel = extractDeepLevel(options)

  return {
    value,
    isReversed,
    deepLevel,
  }
}

/**
 * Extracts the value from the annotation string.
 * @param annotationString The annotation string.
 * @return The extracted value or null if not found.
 */
const extractValue = (annotationString: string) => {
  const startOffset = annotationString.indexOf('(')
  const endOffset = annotationString.indexOf(')', startOffset)

  if (startOffset === -1 || endOffset === -1) {
    return null
  }

  return annotationString.slice(startOffset + 1, endOffset)
}

/**
 * Extracts the deep level from the options.
 * @param options The options array.
 * @return The extracted deep level or 1 if not specified.
 */
const extractDeepLevel = (options: string[]) => {
  const matchedExecResult = options.map((option) => /deep(\((\d+)\))?/.exec(option)).find((execResult) => !!execResult)

  if (!matchedExecResult) {
    return 1 // deep option is not matched
  }

  const level = parseInt(matchedExecResult[2], 10)

  if (isNaN(level)) {
    return Number.MAX_SAFE_INTEGER // infinity deep sorting
  }

  return level
}

export const ConfigUtils = {
  getConfig,
}
