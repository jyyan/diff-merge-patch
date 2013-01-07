
var assert = require('assert')
var diff = require('../lib/index').collections
var Result = diff.Result

describe('collection diff', function() {
  it('should find all added and deleted values', function() {
    var before = [1, 2, 3, 3, 4, 8]
    var after = [4, 1, 2, 5, 6, 6, 8]

    var expectedDiff = {
      insert: [5, 6, 6],
      delete: [2, 3]
    }
    var result = diff(before, after)
    assert.deepEqual(result, expectedDiff)

    var before = [1,2,3,3,4]
    var after = [4,1,2,3,5]
    var expected = { insert: [ 5 ], delete: [ 3 ] }
    var result = diff(before, after)
    assert.deepEqual(result, expected)

    var before = [1,2,3,3,4]
    var after = [1,2,3]
    var expected = { delete: [ 3, 4 ] }
    var result = diff(before, after)
    assert.deepEqual(result, expected)
  })
  it('should compute the difference of two diffs', function() {
    var diff1 = new Result({
      insert: [5, 6, 6],
      delete: [2, 3]
    })
    var diff2 = {
      insert: [6, 7],
      delete: [2]
    }
    var expected = {
      insert: [5, 6],
      delete: [3]
    }
    var result = diff1.difference(diff2)
    assert.deepEqual(result, expected)
  })
})