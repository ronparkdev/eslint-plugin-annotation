# eslint-plugin-annotation/sort-keys
Sort interface properties or object keys if has `@sort-keys` annotation

## Annotation options
* `:reversed` : Use this option to sort in reverse
* `:deep` : Use this option to sort by more than one depth
  * `:deep` : By default, it sorts by depth regardless.
  * `:deep(2)` : If you want to sort only to a certain depth, you need to include a depth value.

### Before apply annotation
```javascript
const nameToAgeMap = {
  Liam: 36,
  Noah: 21,
  Jackson: 15,
  Aiden: 62,
  Elijah: 17,
  Grayson: 27,
  Lucas: 43,
  Oliver: 52,
}
```

### After apply annotation (Autofix by lint)
```javascript
// @sort-keys
const nameToAgeMap = {
  Aiden: 62,
  Elijah: 17,
  Grayson: 27,
  Jackson: 15,
  Liam: 36,
  Lucas: 43,
  Noah: 21,
  Oliver: 52,
}
```

### My best case to use this rule that :
```javascript
// @sort-keys
const reducer = combineReducers({
  detail: detailReducer,
  like: likeReducer,
	user: userReducer,
})
```
If you use a lot of reducers of redux, it becomes difficult to manage, but if you apply it here, it can be simple.
