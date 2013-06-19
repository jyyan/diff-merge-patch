
var _ = require('underscore')

function Result(data) {
  this.diff = data.diff
  if (data.conflict && data.conflict.length) this.conflict = data.conflict
}

var compareBySourceLengthAndValue = function(a, b) {
  if (a.source.length > b.source.length) {
    return true
  } else if (a.source.length < b.source.length) {
    return false
  } else {
    return a.value > b.value
  }
}

var merge = function(diffs) {
  var result = {}
  var conflicts = []
  var setValue = function(source) { return function(entry, key) {
    if (result[key] === undefined) {
      result[key] = {value: entry.value, source: [source]}
    } else {
      if (result[key].constructor != Array) {
        result[key] = [result[key]]
      }
      var existing = _.find(result[key], function(each) { return each.value === entry.value })
      if (existing) {
        existing.source.push(source)
      } else {
        result[key].push({value: entry.value, source: [source]})
        conflicts.push(key)
      }
    }
  }}
  diffs.forEach(function(eachDiff, i) {
    _.each(eachDiff.diff, setValue(i))
  })
  _.each(result, function(entries, key) { if (entries.length == 1) result[key] = entries[0] })

  return new Result({diff: result, conflict: conflicts})
}

merge.Result = Result

module.exports = merge