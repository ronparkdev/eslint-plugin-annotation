import formatDate from './rules/format-date'
import sort from './rules/sort'
import sortKeys from './rules/sort-keys'
import unique from './rules/unique'

// Import all rules in lib/rules
module.exports.rules = {
  'format-date': formatDate,
  sort: sort,
  'sort-keys': sortKeys,
  unique: unique,
}
