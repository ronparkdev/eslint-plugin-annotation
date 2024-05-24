import formatDate from './rules/format-date'
import sort from './rules/sort'
import sortKeys from './rules/sort-keys'

// Import all rules in lib/rules
module.exports.rules = {
  'format-date': formatDate,
  sort: sort,
  'sort-keys': sortKeys,
}
