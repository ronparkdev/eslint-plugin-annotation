# eslint-plugin-annotation/format-date
Ensure dates in strings match the specified `@format-date` annotation

## Annotation options
* `@format-date(YYYY-MM-DD)` : Ensure the date format is `YYYY-MM-DD`
* `@format-date(yyyy-MM-dd'T'HH:mm:ss.SSS'Z')` : Ensure the date format is `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`
* `@format-date(isostring)` : Ensure the date format is ISO string (`yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`)
* `@format-date(utcstring)` : Ensure the date format is UTC string (`EEE, dd MMM yyyy HH:mm:ss 'GMT'`)

### Lint Success Case
```javascript
// @format-date(YYYY-MM-DD)
const date = "2023-05-24";

// @format-date(yyyy-MM-dd'T'HH:mm:ss.SSS'Z')
const isoDate = "2023-05-24T12:34:56.789Z";

// @format-date(isostring)
const isoString = "2023-05-24T12:34:56.789Z";

// @format-date(utcstring)
const utcString = "Wed, 14 Jun 2017 07:00:00 GMT";
```

### Lint Failure Case
```javascript
// @format-date(YYYY-MM-DD)
const date = "05/24/2023";

// @format-date(yyyy-MM-dd'T'HH:mm:ss.SSS'Z')
const isoDate = "2023.05.24 12:34:56.789";

// @format-date(isostring)
const isoString = "2023-05-24 12:34:56.789";

// @format-date(utcstring)
const utcString = "2023-05-24T12:34:56.789Z";
```

### My best case to use this rule that :
If you frequently work with date strings in different formats and need to ensure consistency across your codebase, using this rule can help enforce the desired date format.

```javascript
// @format-date(YYYY-MM-DD)
const birthDate = "2023-05-24";

// @format-date(isostring)
const eventTimestamp = "2023-05-24T12:34:56.789Z";
```
Ensuring all date strings are in the specified format can help avoid issues with date parsing and formatting in your application.
