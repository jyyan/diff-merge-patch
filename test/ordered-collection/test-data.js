
module.exports = [
  {
    before: [1, 2],
    after: [
      [2, 1, 3],
      [1, 2, 4]
    ],
    diffs: [
      {"insert":[[1,[3]]],"move":[[1,[0,1]]]},
      {"insert":[[1,[4]]]}
    ],
    diffsMerged: {"move":[[1,[0,1]]],"insert":[[1,[3]],[1,[4]]]}
  }, {
    before: [1, 2, 3, 4, 5, 6, 7],
    after: [
      [1, 2, 7, 3, 4, 5, 6],
      [1, 6, 2, 3, 4, 5, 7]
    ],
    diffs: [
      {"move":[[1,[6,1]]]},
      {"move":[[0,[5,1]]]}
    ],
    diffsMerged: {"move":[[0,[5,1]],[1,[6,1]]]}
  }, {
    before: [1, 2, 3, 4, 5],
    after: [
      [1, 6, 2, 3, 5, 4],
      [1, 2, 3, 4, 7, 5]
    ],
    diffs: [
      {
        insert: [[0,[6]]],
        move: [[4,[3, 1]]]
      }, {
        insert: [ [ 3, [7] ] ]
      }
    ],
    diffsMerged: {"move":[[4,[3,1]]],"insert":[[0,[6]],[3,[7]]]}
  }, {
    before: [1, 2, 3, 4, 5],
    after: [
      [2, 6, 1, 3, 5, 4],
      [2, 3, 1, 4, 7, 5]
    ],
    diffs: [
      {"insert":[[1,[6]]],"move":[[1,[0,1]],[4,[3,1]]]},
      {"insert":[[3,[7]]],"move":[[2,[0,1]]]}
    ],
    diffsMerged: {
      conflict: true,
      insert: [[1,[6]],[3,[7]]],
      move: [
        [[1,[0,1]],[4,[3,1]]],
        [[2,[0,1]],[4,[3,1]]]
      ]
    }
  }, {
    before: [1, 2, 3, 4, 5],
    after: [
      [2, 6, 1, 5, 4, 3],
      [2, 4, 1, 7, 3, 5]
    ],
    diffs: [
      {"insert":[[3,[6]]],"move":[[3,[0,1]],[4,[3,1]],[4,[2,1]]]},
      {"insert":[[3,[7]]],"move":[[3,[0,1]],[3,[2,1]]]}
    ],
    diffsMerged: {
      conflict: true,
      insert: [[3,[6]], [3,[7]]],
      move: [
        [[3,[0,1]], [4,[3,1]], [4,[2,1]]],
        [[3,[0,1]], [3,[2,1]], [4,[3,1]]]
      ]
    }
  }, {
    //test deletes:
    before: [1, 2, 3, 4, 5],
    after: [
      [1, 2, 5, 4],
      [2, 3, 1, 4, 5]
    ],
    diffs: [
      {"delete":[[2,1]],"move":[[4,[3,1]]]},
      {"move":[[2,[0,1]]]}
    ],
    diffsMerged: {"move":[[2,[0,1]],[4,[3,1]]],"delete":[[2,1]]}
  }, {
    // test delete conflicts:
    before: [1, 2, 3, 4, 5],
    after: [
      [1, 2, 3, 4],
      [5, 1, 2, 3, 4]
    ],
    diffs: [
      {"delete":[[4,1]]},
      {"move":[[-1,[4,1]]]}
    ],
    diffsMerged: {"conflict":true, "move":[[],[[-1,[4,1]]]],"delete":[[[4,1]],[]]}
  }, {
    before: [1, 2, 3, 4, 5, 6],
    after: [
      [1, 2, 3, 6, 4, 5],
      [4, 5, 6, 1, 2, 3],
      [4, 5, 3, 1, 2, 6]
    ],
    diffs: [
      {
        move: [ [ 2, [5, 1] ] ]
      }, {
        move: [ [ 5, [0, 3] ] ]
      }, {
        move: [[4,[2,1]],[4,[0,1]],[4,[1,1]]]
      }
    ],
    diffsMerged: {
      "move":[
        [[2,[5,1]]],
        [[5,[0,3]],[2,[5,1]]],
        [[4,[2,1]],[4,[0,2]],[2,[5,1]]]
      ],
      "conflict":true
    }
  }, {
    before: [1, 2, 3, 4, 5],
    after: [
      [2, 6, 1, 3, 5, 4],
      [2, 3, 1, 4, 7, 5],
      [1, 2, 3, 4, 5],
      [1, 8, 2, 3, 4, 5]
    ],
    diffs: [
      {"insert":[[1,[6]]],"move":[[1,[0,1]],[4,[3,1]]]},
      {"insert":[[3,[7]]],"move":[[2,[0,1]]]},
      {},
      {"insert":[[0,[8]]]}
    ],
    diffsMerged: {
      "conflict":true,
      "insert":[[1,[6]],[3,[7]],[0,[8]]],
      "move":[
        [[1,[0,1]],[4,[3,1]]],
        [[2,[0,1]],[4,[3,1]]],
        [[4,[3,1]]],
        [[4,[3,1]]]
      ]
    }
  }
]
