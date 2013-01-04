
var _ = require('underscore')
var mergeRanges = require('./range-map')

var diffToRanges = function(diff) {
  var moveRanges = (diff.move || []).map(function(each) {
    return {range: [each[1][0], each[1][0] + each[1][1] - 1], value: each[0]}
  })
  var deleteRanges = (diff.delete || []).map(function(each) {
    return {range: [each[0], each[0] + each[1] - 1], value: null}
  })
  return moveRanges.concat(deleteRanges)
}

var rangesToDiff = function(ranges) {
  var result = {}
  ranges.forEach(function(each) {
    if (each.value === null) {
      if (!result.delete) result.delete = []
      result.delete.push([each.range[0], each.range[1] - each.range[0] + 1])
    } else {
      if (!result.move) result.move = []
      result.move.push([each.value, [each.range[0], each.range[1] - each.range[0] + 1]])
    }
  })
  return result
}

var merge = function(diffs) {
  var updateRanges = diffs.map(diffToRanges)
  var mergedUpdateRanges = mergeRanges(updateRanges)

  var insert = []
  diffs.forEach(function(each) { if (each.insert) insert = insert.concat(each.insert) })
  var result = {}
  if (insert.length) result.insert = insert

  if (mergedUpdateRanges.conflict) {
    result.move = []; result.delete = []
    mergedUpdateRanges.result.forEach(function(each) {
      var updateResult = rangesToDiff(each)
      result.move.push(updateResult.move || [])
      result.delete.push(updateResult.delete || [])
    })

    var keys = ['move', 'delete']
    keys.forEach(function(key) {
      if (_.all(result[key], function(each) { return each.length == 0 }))
        delete result[key]
    })
    return {conflict: true, result: result}
  } else {
    var updateResult = rangesToDiff(mergedUpdateRanges.result)
    return {result: _.extend(result, updateResult)}
  }
}

module.exports = merge