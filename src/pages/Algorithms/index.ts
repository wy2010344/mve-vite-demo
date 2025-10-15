/**
 二分查找、
 递归、
 动态规划（DP）、
 哈希表（Hash）、
 深度优先搜索（DFS）——递归?、
 广度优先搜索（BFS）——循环?
 */

export default 1;

/**
 * DFS
 */

type TreeNode = {
  left?: TreeNode;
  right?: TreeNode;
};
/**
 * 这个是最小深度吧,广度遍历
 * @param root
 * @returns
 */
function minDepth(root?: TreeNode) {
  if (!root) {
    return 0;
  }
  const list = [
    {
      who: root,
      depth: 1,
    },
  ];
  while (list.length) {
    const { who, depth } = list.shift()!;
    let shouldRet = true;
    if (who.left) {
      shouldRet = false;
      list.push({
        who: who.left,
        depth: depth + 1,
      });
    }
    if (who.right) {
      shouldRet = false;
      list.push({
        who: who.right,
        depth: depth + 1,
      });
    }
    if (shouldRet) {
      return depth;
    }
  }
  return 0;
}

/**
 * 岛屿数量
 * 通常给定一个由 '1'（陆地）和 '0'（水）组成的二维网格，要求计算其中岛屿的数量。岛屿被水包围，并且通过水平或垂直方向的陆地连接形成。
 */

type LandType = 0 | 1;
/**深度优先遍历 */
function numIslandsDFS(grid?: LandType[][]): number {
  if (!grid?.length) {
    return 0;
  }

  const rows = grid.length;
  const cols = grid[0].length;
  let islandCount = 0;

  const dfs = (r: number, c: number) => {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] == 0) {
      return;
    }
    //使岛屿沉没
    grid[r][c] = 0;
    dfs(r - 1, c);
    dfs(r + 1, c);
    dfs(r, c - 1);
    dfs(r, c - 1);
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c]) {
        islandCount++;
        //使岛屿沉没
        dfs(r, c);
      }
    }
  }
  return islandCount;
}

// 定义方向数组（上、下、左、右）
const directions = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];
/**
 * 广度优先遍历,感觉不太对,只是一种优化
 * */
function numIslandsBFS(grid?: LandType[][]): number {
  if (!grid?.length) {
    return 0;
  }

  const rows = grid.length;
  const cols = grid[0].length;
  let islandCount = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c]) {
        islandCount++;

        const queue: [number, number][] = [[r, c]];
        grid[r][c] = 0;
        while (queue.length) {
          const [cR, cC] = queue.shift()!;
          directions.forEach(function ([dr, dc]) {
            const nR = cR + dr;
            const nC = cC + dc;
            if (
              nR < 0 ||
              nC < 0 ||
              nR >= rows ||
              nC >= cols ||
              grid[nR][nC] == 0
            ) {
              return;
            }
            queue.push([nR, nC]);
            grid[nR][nC] = 0;
          });
        }
      }
    }
  }
  return islandCount;
}
