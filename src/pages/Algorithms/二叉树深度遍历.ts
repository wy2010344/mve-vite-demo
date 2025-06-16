
export default 1

type TreeNode = {
  left?: TreeNode
  right?: TreeNode
  value: number
}

/**
 * 给定一个二叉树的根节点 root，返回其节点值的层序遍历结果（即逐层从左到右访问所有节点）。
 * 
 * 时间复杂度O(N)
 * 空间复杂度
 *  BFS:O(N) 最坏情况队列会存储树的一层节点
 *  DFS:O(H) H为树的高度
 * 
输入：
    3
   / \
  9  20
    /  \
   15   7

输出：
[
  [3],
  [9,20],
  [15,7]
]
 */


function levelOrderBFS(root?: TreeNode) {
  if (!root) {
    return
  }
  const results: number[][] = []
  const queue: TreeNode[] = [root]
  while (queue.length) {
    const levelSize = queue.length
    const currentLevel: number[] = []
    for (let i = 0; i < levelSize; i++) {
      const currentNode = queue.shift()!
      currentLevel.push(currentNode.value)
      if (currentNode.left) {
        queue.push(currentNode.left)
      }
      if (currentNode.right) {
        queue.push(currentNode.right)
      }
    }
    results.push(currentLevel)
  }
  return results
}


function levelOrder(root?: TreeNode) {
  const results: number[][] = []
  const traverse = (node: TreeNode | undefined, level: number) => {
    if (!node) {
      return
    }
    if (!results[level]) {
      results[level] = []
    }
    results[level].push(node.value)
    traverse(node.left, level + 1)
    traverse(node.right, level + 1)
  }
  traverse(root, 0)
  return results
}