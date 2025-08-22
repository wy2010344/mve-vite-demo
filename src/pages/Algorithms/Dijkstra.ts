/**
 * 图下记录着每个点,到可达点的距离
 */
type Graph = Record<string, Record<string, number>>;

function dijkstra(graph: Graph, start: string) {
  /**
   * 所有节点到起点的距离,除start本身,默认为Infinity
   */
  const distances: Record<string, number> = {};

  const previous: Record<string, string | null> = {};

  const nodes = new Set<string>();

  for (const vertex in graph) {
    distances[vertex] = vertex == start ? 0 : Infinity;
    previous[vertex] = null;
    nodes.add(vertex);
  }

  while (nodes.size) {
    //选择当前点距离最小的未访问节点
    let current: string | null = null;
    for (const node of nodes) {
      if (current === null || distances[node] < distances[current]) {
        //初始为第一个,然后寻找距离更小的节点
        current = node;
        console.log("current", current);
      }
    }

    if (current === null || distances[current] == Infinity) {
      //没有找到节点
      console.log("break");
      break;
    }
    console.log("delete", current);
    nodes.delete(current);

    for (const neighbor in graph[current]) {
      const distance = distances[current] + graph[current][neighbor];
      if (distance < distances[neighbor]) {
        //到达相邻节点更近
        distances[neighbor] = distance;
        previous[neighbor] = current;
      }
    }
  }
  return {
    distances,
    previous,
  };
}

function getPath(previous: Record<string, string | null>, target: string) {
  const path: string[] = [];
  let current: string | null = target;
  while (current != null) {
    path.unshift(current);
    current = previous[current];
  }
  return path;
}

const graph: Graph = {
  A: {
    B: 4,
    C: 2,
  },
  B: {
    C: 5,
    D: 10,
  },
  C: { E: 3 },
  D: { F: 11 },
  E: { D: 4 },
  F: {},
};

const { distances, previous } = dijkstra(graph, "A");
const pathToF = getPath(previous, "F");
const distanceToF = distances["F"];

console.log(`最短路径:${pathToF.join(" -> ")}`);
console.log(`总距离:${distanceToF}`);
