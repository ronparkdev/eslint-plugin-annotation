"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HAS_UNSORTED_KEYS_MESSAGE_ID = void 0;
const types_1 = require("@typescript-eslint/types");
const array_1 = require("../utils/array");
const comparer_1 = require("../utils/comparer");
const config_1 = require("../utils/config");
const createRule_1 = require("../utils/createRule");
const fix_1 = require("../utils/fix");
exports.HAS_UNSORTED_KEYS_MESSAGE_ID = 'hasUnsortedKeys';
const getParentNodeConfig = (node, parentTypes, deepCountingTypes, sourceCode) => {
    let currentNode = node;
    let deepLevel = 1;
    while ((currentNode = currentNode.parent) !== null) {
        if (deepCountingTypes.includes(currentNode.type)) {
            deepLevel += 1;
        }
        if (parentTypes.includes(currentNode.type)) {
            const commentExpectedEndLine = currentNode.loc.start.line - 1;
            const config = config_1.ConfigUtils.getConfig(sourceCode, '@sort-keys', commentExpectedEndLine);
            if (config.deepLevel < deepLevel) {
                return null;
            }
            return { config, deepLevel };
        }
    }
    return null;
};
const getCurrentNodeConfig = (node, sourceCode) => {
    const commentExpectedEndLine = node.loc.start.line - 1;
    const config = config_1.ConfigUtils.getConfig(sourceCode, '@sort-keys', commentExpectedEndLine);
    return { config };
};
const checkAndReport = (node, comparer, getProperties, sourceCode, report) => {
    const properties = getProperties(node);
    const sortedProperties = [...properties].sort(comparer);
    const needSort = array_1.ArrayUtils.zip2(properties, sortedProperties).some(([property, sortedProperty]) => property !== sortedProperty);
    if (needSort) {
        const diffRanges = array_1.ArrayUtils.zip2(properties, sortedProperties).map(([from, to]) => ({
            from: from.range,
            to: to.range,
        }));
        const fixedText = fix_1.FixUtils.getFixedText(sourceCode, node.range, diffRanges);
        report({
            node,
            messageId: exports.HAS_UNSORTED_KEYS_MESSAGE_ID,
            fix(fixer) {
                return fixer.replaceTextRange(node.range, fixedText);
            },
        });
    }
};
exports.default = (0, createRule_1.createRule)({
    name: 'sort-keys',
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
            [exports.HAS_UNSORTED_KEYS_MESSAGE_ID]: `has unsorted keys`,
        },
    },
    defaultOptions: [],
    create(context) {
        const sourceCode = context.getSourceCode();
        return {
            ObjectExpression(node) {
                const result = getParentNodeConfig(node, [types_1.AST_NODE_TYPES.VariableDeclaration, types_1.AST_NODE_TYPES.TSTypeAliasDeclaration], [types_1.AST_NODE_TYPES.ObjectExpression], sourceCode);
                if (!result || !result.config) {
                    return;
                }
                const { config, deepLevel } = result;
                const { isReversed } = config;
                const comparer = comparer_1.ComparerUtils.makeObjectPropertyComparer({ isReversed });
                checkAndReport(node, comparer, (node) => node.properties, sourceCode, context.report);
            },
            TSInterfaceBody(node) {
                const result = getParentNodeConfig(node, [types_1.AST_NODE_TYPES.TSInterfaceDeclaration], [types_1.AST_NODE_TYPES.TSInterfaceBody], sourceCode);
                if (!result || !result.config) {
                    return;
                }
                const { config, deepLevel } = result;
                const { isReversed } = config;
                const comparer = comparer_1.ComparerUtils.makeInterfacePropertyComparer({ isReversed });
                checkAndReport(node, comparer, (node) => node.body, sourceCode, context.report);
            },
            TSTypeLiteral(node) {
                const result = getParentNodeConfig(node, [types_1.AST_NODE_TYPES.TSInterfaceDeclaration, types_1.AST_NODE_TYPES.TSTypeAliasDeclaration], [types_1.AST_NODE_TYPES.TSInterfaceBody, types_1.AST_NODE_TYPES.TSTypeLiteral], sourceCode);
                if (!result || !result.config) {
                    return;
                }
                const { config, deepLevel } = result;
                const { isReversed } = config;
                const comparer = comparer_1.ComparerUtils.makeInterfacePropertyComparer({ isReversed });
                checkAndReport(node, comparer, (node) => node.members, sourceCode, context.report);
            },
            TSEnumDeclaration(node) {
                const { config } = getCurrentNodeConfig(node, sourceCode);
                if (!config) {
                    return;
                }
                const { isReversed } = config;
                const comparer = comparer_1.ComparerUtils.makeEnumMemberComparer({ isReversed });
                checkAndReport(node, comparer, (node) => node.members, sourceCode, context.report);
            },
        };
    },
});
