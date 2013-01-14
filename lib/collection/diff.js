
var _ = require('underscore')

function Result(diff) {
  if (diff.insert && diff.insert.length) this.insert = diff.insert.sort()
  if (diff.delete && diff.delete.length) this.delete = diff.delete.sort()
}

var valueMap = function(array) {
  var map = {}
  array.forEach(function(each) {
    map[each] = map[each] || {value: each, count: 0}
    map[each].count++
  })
  return map
}

var diff = function(before, after) {
  before = _.clone(before).sort()
  after = _.clone(after).sort()
  var result = {
    insert: [],
    delete: []
  }
  var afterIndex = 0
  before.forEach(function(each, i) {
    while(each > after[afterIndex]) {
      result.insert.push({value: after[afterIndex]})
      afterIndex++
    }
    if (each == after[afterIndex]) {
      afterIndex++
    } else {
      result.delete.push({index: i})
    }
  })
  var rest = after.slice(afterIndex).map(function(each) { return {value: each} })
  result.insert = result.insert.concat(rest)
  return new Result(result)
}

diff.Result = Result

module.exports = diff
