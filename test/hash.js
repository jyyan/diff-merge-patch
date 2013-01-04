
var assert = require('assert')
var diff = require('diffit').hashs
var merge = require('../lib/index').hashs

describe('hash merging', function() {
  var before = {
    1: 1,
    2: 2,
    3: 3,
    4: 4
  }

  var after1 = {
    5: 6,
    3: 8,
    2: 2,
    4: 4,
    1: 5
  }

  var after2 = {
    2: 2,
    1: 9,
    4: 5
  }

  it('should do a 3-way merge', function() {

    var expected = {
      hash: {
        1: [5, 9],
        2: 2,
        3: [8, null],
        4: 5,
        5: 6
      },
      conflicts: [1, 3]
    }
    var result = merge(before, [diff(before, after1), diff(before, after2)])
    assert.deepEqual(result, expected)
  })
  it('should test an n-way merge', function() {
    var after3 = {
      1: 1,
      2: 3,
      4: 6,
      7: 9
    }
    var expected = {
      hash: {
        1: [5, 9],
        2: 3,
        3: [8, null, null],
        4: [5, 6],
        5: 6,
        7: 9
      },
      conflicts: [1, 3, 4]
    }
    var diffs = [after1, after2, after3].map(function(each) { return diff(before, each) })
    var result = merge(before, diffs)
    assert.deepEqual(result, expected)
  })
  it('should test commutative conflict resolution', function() {
    var result1 = {
      hash: {
        1: [5, 9],
        2: 3,
        3: [null, 8, null],
        4: [6, 5],
        5: 6,
        7: 9
      },
      conflicts: [1, 3, 4]
    }
    var result2 = {
      hash: {
        1: [5, 9],
        2: 3,
        3: [8, null, null],
        4: [5, 6],
        5: 6,
        7: 9
      },
      conflicts: [1, 3, 4]
    }
    var expected = {
      hash: {
        1: 5,
        2: 3,
        3: 8,
        4: 5,
        5: 6,
        7: 9
      }
    }
    var resolvedResult1 = merge.resolveConflicts(result1)
    var resolvedResult2 = merge.resolveConflicts(result2)
    assert.deepEqual(resolvedResult1, expected)
    assert.deepEqual(resolvedResult1, resolvedResult2)
  })
})
