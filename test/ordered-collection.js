
var assert = require('assert')
var diff = require('diffit').orderedCollections({unique:true})
var mergeDiffs = require('../lib/index').orderedCollections

var merge = function(origin, modified1, modified2) {
  var result = mergeDiffs([diff(origin, modified1), diff(origin, modified2)])
  return result
}

describe('ordered collection merge', function() {
  it('should compute a diff map', function() {
    
  })
  it('should merge without conflicts', function() {
    var origin = [1, 2, 3, 4, 5]
    var modified1 = [1, 6, 2, 3, 5, 4]
    var modified2 = [1, 2, 3, 4, 7, 5]
    //var expected = {result: [1, 6, 2, 3, 7, 5, 4]}
    var expected = {"result":{"move":[[4,[3,1]]],"insert":[[0,[6]],[3,[7]]]}}
    var merged = merge(origin, modified1, modified2)
    assert.deepEqual(merged, expected)

    var origin = [1, 2, 3, 4, 5]
    var modified1 = [1, 2, 6, 3, 4, 5]
    var modified2 = [1, 2, 3, 4, 7, 5]
    //var expected = {result: [1, 2, 6, 3, 4, 7, 5]}
    var expected = {"result":{"insert":[[1,[6]],[3,[7]]]}}
    var merged = merge(origin, modified1, modified2)
    assert.deepEqual(merged, expected)

    var origin = [1, 2]
    var modified1 = [2, 1, 3]
    var modified2 = [1, 2, 4]
    //var expected = {result: [2, 4, 1, 3]}
    var expected = {"result":{"move":[[1,[0,1]]],"insert":[[1,[3]],[1,[4]]]}}
    var merged = merge(origin, modified1, modified2)
    assert.deepEqual(merged, expected)

    var origin = [1, 2, 3, 4, 5, 6, 7]
    var modified1 = [1, 2, 7, 3, 4, 5, 6]
    var modified2 = [1, 6, 2, 3, 4, 5, 7]
    //var expected = {result: [1, 6, 2, 7, 3, 4, 5]}
    var expected = {"result":{"move":[[0,[5,1]],[1,[6,1]]]}}
    var merged = merge(origin, modified1, modified2)
    assert.deepEqual(merged, expected)
  })
  it('should merge with conflicts', function() {
    var origin = [1, 2, 3, 4, 5]
    var modified1 = [2, 6, 1, 3, 5, 4]
    var modified2 = [2, 3, 1, 4, 7, 5]
    //var expected = {conflict:true, result:[[2, 6, 1, 3, 7, 5, 4], [2, 6, 3, 1, 7, 5, 4]]}
    var expected = {
      conflict: true,
      result: {
        insert: [[1,[6]],[3,[7]]],
        move: [
          [[1,[0,1]],[4,[3,1]]],
          [[2,[0,1]],[4,[3,1]]]
        ]
      }
    }
    var merged = merge(origin, modified1, modified2)
    assert.deepEqual(merged, expected)

    var origin = [1, 2, 3, 4, 5]
    var modified1 = [2, 6, 1, 5, 4, 3]
    var modified2 = [2, 4, 1, 7, 3, 5]
    //var expected = {conflict:true, result:[[2, 6, 1, 7, 5, 4, 3], [2, 6, 1, 7, 3, 5, 4]]}
    var expected = {
      conflict: true,
      result: {
        insert: [[3,[6]], [3,[7]]],
        move: [
          [[3,[0,1]], [4,[3,1]], [4,[2,1]]],
          [[3,[0,1]], [3,[2,1]], [4,[3,1]]]
        ]
      }
    }
    var merged = merge(origin, modified1, modified2)
    assert.deepEqual(merged, expected)
  })
  it('should merge with deletes', function() {
    var origin = [1, 2, 3, 4, 5]
    var modified1 = [1, 2, 5, 4]
    var modified2 = [2, 3, 1, 4, 5]
    //var expected = {result: [2, 1, 5, 4]}
    var expected = {"result":{"move":[[2,[0,1]],[4,[3,1]]],"delete":[[2,1]]}}
    var merged = merge(origin, modified1, modified2)
    assert.deepEqual(merged, expected)
  })
  it('should merge with delete conflicts', function() {
    var origin = [1, 2, 3, 4, 5]
    var modified1 = [1, 2, 3, 4]
    var modified2 = [5, 1, 2, 3, 4]
    //var expected = {result: [2, 1, 5, 4]}
    var expected = {"conflict":true,"result":{"move":[[],[[-1,[4,1]]]],"delete":[[[4,1]],[]]}}
    var merged = merge(origin, modified1, modified2)
    assert.deepEqual(merged, expected)
  })
  it('should do a n-way merge with conflicts', function() {
    var o = [1, 2, 3, 4, 5]
    var changes = [
      [2, 6, 1, 3, 5, 4],
      [2, 3, 1, 4, 7, 5],
      [1, 2, 3, 4, 5],
      [1, 8, 2, 3, 4, 5]
    ]
    //var expected = {"conflict":true,"result":[[8,2,6,1,3,7,5,4],[8,2,6,3,1,7,5,4],[1,8,2,6,3,7,5,4],[1,8,2,6,3,7,5,4]]}
    var expected = {
      "conflict":true,
      "result":{
        "insert":[[1,[6]],[3,[7]],[0,[8]]],
        "move":[
          [[1,[0,1]],[4,[3,1]]],
          [[2,[0,1]],[4,[3,1]]],
          [[4,[3,1]]],
          [[4,[3,1]]]
        ]
      }
    }
    var diffs = changes.map(function(each) { return diff(o, each) })
    var merged = mergeDiffs(diffs)
    assert.deepEqual(merged, expected)
  })
  it('should test commutative conflict resolution', function() {
    var result1 = {
      "insert":[[1,[6]],[3,[7]],[0,[8]]],
      "move":[
        [[1,[0,1]],[4,[3,1]]],
        [[2,[0,1]],[4,[3,1]]],
        [[4,[3,1]]]
      ]
    }
    var result2 = {
      "insert":[[1,[6]],[3,[7]],[0,[8]]],
      "move":[
        [[4,[3,1]]],
        [[2,[0,1]],[4,[3,1]]],
        [[1,[0,1]],[4,[3,1]]]
      ]
    }
    var expected = {
      "insert":[[1,[6]],[3,[7]],[0,[8]]],
      "move": [[1,[0,1]],[4,[3,1]]]
    }
    var resolvedResult1 = mergeDiffs.resolveConflicts.commutative(result1)
    var resolvedResult2 = mergeDiffs.resolveConflicts.commutative(result2)
    assert.deepEqual(resolvedResult1, expected)
    assert.deepEqual(resolvedResult1, resolvedResult2)
  })
})
