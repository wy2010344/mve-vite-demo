/**
 * 最小生成树算法
 * @param graph
 */

function prim(graph: number[][]) {
  const n = graph.length;
  const lowCost = new Array(n).fill(Infinity);
  lowCost[0] = 0;

  let totalWeight = 0;
  for (let i = 0; i < n; i++) {
    let min = Infinity,
      u = -1;
    for (let j = 0; j < n; j++) {
      if (lowCost[j] < min && lowCost[j] !== -1) {
        min = lowCost[j];
        u = j;
      }
    }

    if (u == -1) {
      break;
    }

    totalWeight += min;
    lowCost[u] = -1;
    for (let v = 0; v < n; v++) {
      if (graph[u][v] < lowCost[v]) {
        lowCost[v] = graph[u][v];
      }
    }
  }
  return totalWeight;
}
