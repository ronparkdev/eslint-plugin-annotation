# eslint-plugin-annotation
[![NPM version][npm-image]][npm-url] [![Build Status][build-image]][build-url]

An ESLint plugin that collects rules to exceptionally validate and autocorrect code with annotations in comments. 


| `annotation/sort` | `annotation/sort-keys` 
|---|---|
| ![sort](https://user-images.githubusercontent.com/47266692/228701112-0db47098-7eea-4ba9-953c-a38fb82f69d8.gif) | ![sort-keys](https://user-images.githubusercontent.com/47266692/228700878-75c1ee11-3e4d-4668-aa60-fcc65ea4d519.gif) |

# Installation
You’ll first need to install ESLint:
```
npm i eslint --save-dev
```

Next, install `eslint-plugin-annotation`:
```
npm i eslint-plugin-annotation --save-dev
```

# Usage
Here’s a suggested ESLint configuration that:
```javascript
{
  "parserOptions": { ... }, // Nothing changed
  "plugins": [..., "annotation"], // Add 'annotation' next to old plugins
  "rules": {
    ...
    // Add below rules next to old rules 
    'annotation/format-date': 'error',
    'annotation/sort-keys': 'error',
    'annotation/sort': 'error',
  }
}
```

# Supported Rules
| Rule | Description | Autofix |
|---|---|---|
| [`format-date`](https://github.com/ronparkdev/eslint-plugin-annotation/blob/master/documents/format-date.md) | Ensure dates in strings match the specified `@format-date` annotation | ❌ |
| [`sort-keys`](https://github.com/ronparkdev/eslint-plugin-annotation/blob/master/documents/sort-keys.md) | Sort interface properties or object keys if has `@sort-keys` annotation | ✔️ |
| [`sort`](https://github.com/ronparkdev/eslint-plugin-annotation/blob/master/documents/sort.md) | Sort array values if has `@sort` annotation | ✔️ |

# License
BSD License


[npm-image]: http://img.shields.io/npm/v/eslint-plugin-annotation.svg
[npm-url]: https://npmjs.org/package/eslint-plugin-annotation

[build-image]: http://img.shields.io/github/workflow/status/ronparkdev/eslint-plugin-annotation/Build%20and%20unit%20test.svg
[build-url]: https://github.com/ronparkdev/eslint-plugin-annotation/actions/workflows/ci.yml
