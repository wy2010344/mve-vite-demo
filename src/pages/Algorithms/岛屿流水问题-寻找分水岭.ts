function findWaterDivide(grid: number[][]) {
  if (!grid.length) {
    return
  }
  if (!grid[0].length) {
    return
  }
  const m = grid.length
  const n = grid[0].length
  //创建两个矩阵来记录流向

  //上与左
  const canReachLT = Array.from({ length: m }).map(() => Array(n).fill(false))
  //下与右
  const canReachRB = Array.from({ length: m }).map(() => Array(n).fill(false))

  for (let y = 0; y < m; y++) {
    for (let x = 0; x < n; x++) {
      if (x == 0 || y == 0) {
        canReachLT[y][x] = true
        continue
      }
      const current = grid[y][x]
      let fromTop = false, fromLeft = false
      if (y > 0 && grid[y - 1][x] <= current) {
        fromTop = canReachLT[y - 1][x]
      }
      if (x > 0 && grid[y][x - 1] <= current) {
        fromLeft = canReachLT[y][x - 1]
      }
      canReachLT[y][x] = fromTop || fromLeft
    }
  }

  const m1 = m - 1
  const n1 = n - 1
  for (let y = m1; y > -1; y--) {
    for (let x = n1; x > -1; x--) {
      if (x == n1 || y == m1) {
        canReachRB[y][x] = true
        continue
      }
      const current = grid[y][x]
      let fromBottom = false, fromRight = false
      if (y < m1 && grid[y + 1][x] <= current) {
        fromBottom = canReachRB[y + 1][x]
      }
      if (x < n1 && grid[y][x + 1] <= current) {
        fromRight = canReachRB[y][x + 1]
      }
      canReachRB[y][x] = fromBottom || fromRight
    }
  }

  console.log(canReachLT, canReachRB)

  //收集结果

  const results: [number, number][] = []
  for (let y = 0; y < m; y++) {
    for (let x = 0; x < n; x++) {
      if (canReachLT[y][x] && canReachRB[y][x]) {
        results.push([y, x])
      }
    }
  }
  return results
}

console.log(findWaterDivide([
  [1, 2, 2, 3, 5],
  [3, 2, 3, 4, 4],
  [2, 4, 5, 3, 1],
  [6, 7, 1, 4, 5],
  [5, 1, 1, 2, 4]
]))