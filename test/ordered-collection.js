
var assert = require('assert')

var orderedColDiff = require('../lib/ordered-collection')
var diff = orderedColDiff({unique:true})
var diffCompressed = orderedColDiff({unique:true, compress: true})

describe('ordered collection diff', function() {
  it('should find the position diff', function() {
    var before = [1, 2, 3, 4]
    var after = [2, 1, 5]
    var diffExpected = [
      ['x', 1],
      ['=', 1],
      ['-', 2],
      ['p', [0]],
      ['+', [5]]
    ]
    var diffRes = diff(before, after, true)
    assert.deepEqual(diffRes, diffExpected)
  })
  it('should find more diffs...', function() {
    var before = [1, 2, 3, 4, 5]
    var after1 = [1, 6, 2, 3, 5, 4]
    var diffExpected1 = [
      ['=', 1],
      ['+', [6]],
      ['=', 2],
      ['x', 1],
      ['=', 1],
      ['p', [3]]
    ]
    var diffRes1 = diff(before, after1, true)
    assert.deepEqual(diffRes1, diffExpected1)

    var after2 = [1, 2, 3, 4, 7, 5]
    var diffExpected2 = [
      ['=', 4],
      ['+', [7]],
      ['=', 1]
    ]
    var diffRes2 = diff(before, after2, true)
    assert.deepEqual(diffRes2, diffExpected2)

    var before = [1,2,3]
    var after = [5,4,3]
    var expected = [['-', 2], ['+', [5, 4]], ['=', 1]]
    var diffRes3 = diff(before, after, true)
    assert.deepEqual(diffRes3, expected)

    var result = diff([1, 2, 3, 4, 5], [1, 2, 3, 4, 7, 5], true)
    var expected = [['=', 4], ['+', [7]], ['=', 1]]
    assert.deepEqual(result, expected)

    var result = diff([1, 2, 3, 4, 5, 6], [1, 2, 3, 6, 4, 5], true)
    var expected = [['=', 3],['p', [5]],['=', 2],['x', 1]]
    assert.deepEqual(result, expected)
  })
})

