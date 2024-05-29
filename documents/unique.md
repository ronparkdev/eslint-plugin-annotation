# eslint-plugin-annotation/unique
Ensure array values are unique if annotated with `@unique`

## Annotation options
* `@unique` : Ensure all values in the array are unique

### Lint Success Case
```javascript
// @unique
const ids = [1, 2, 3, 4, 5];

// @unique
const names = ["Alice", "Bob", "Charlie"];
```

### Lint Failure Case
```javascript
// @unique
const ids = [1, 2, 2, 4, 5];

// @unique
const names = ["Alice", "Bob", "Alice"];
```

### My best case to use this rule that :
If you frequently work with arrays that require unique values, using this rule can help enforce uniqueness across your codebase.

```javascript
// @unique
const userIds = [101, 102, 103, 104];

// @unique
const userNames = ["John", "Doe", "Jane", "Smith"];
```
Ensuring all values in the array are unique can help avoid issues with duplicate entries in your application.
