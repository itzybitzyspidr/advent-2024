import { getInputAsGrid } from "../../helpers/read-inputs";

/**
 * Build a set of connected nodes. Each node just connects to the next node with a direction and # of tiles.
 * Node is marked as Goal if terminal
 * 
 * for each node + direction combo, store cost to reach and traversed nodes to reach it.
 *  If new low cost, clear traversed nodes.
 *  If tied low cost, add any new nodes.
 *  If new higher cost, terminate path.
 * 
 * Final result will collate all paths included in tied lowest paths.
 */

interface ICoordinate {
  row: number;
  col: number;
}

interface IMazeNode {
  coords: ICoordinate;
  connectedNodes: IMazeNode[];
  goal: boolean;
  start: boolean;
}

export function y2024d16p2(): number {
  const input = getInputAsGrid(16).body;
  const nodes = mapNodes(input);
  populateNodes(nodes, input);
  
  const startNode = findStart(nodes);
  const bestPaths = new Map<string, number>();
  const solutions: IMazeNode[][] = [];
  bruteForce(startNode, [], solutions, bestPaths);
  
  const scores = solutions.map((solution) => scorePath(solution));
  const minimum = Math.min(...scores);

  const optimalPathIdxList: number[] = [];
  scores.forEach((score, i) => {
    if (score === minimum) {
      optimalPathIdxList.push(i);
    }
  });

  console.log(optimalPathIdxList);

  const visitiedTiles = new Set<string>();
  for (const index of optimalPathIdxList) {
    updateVisitedTiles(visitiedTiles, solutions[index]);
  }

  return visitiedTiles.size;
}

function mapNodes(grid: string[][]): Map<string, IMazeNode> {
  const nodeMap = new Map<string, IMazeNode>();

  for (const [row, line] of grid.entries()) {
    for (const [col, char] of line.entries()) {
      if (char !== '#') {
        if (hasVertPath(row, col, grid) && hasHorizPath(row, col, grid)) {
          nodeMap.set(`${row}-${col}`, {
            connectedNodes: [],
            coords: {
              row,
              col,
            },
            goal: char === 'E',
            start: char === 'S',
          });
        }
      }
    }
  }
  return nodeMap;
}

function populateNodes(nodes: Map<string, IMazeNode>, grid: string[][]): void {
  for (const node of nodes.values()) {
    const offsets: number[] = [0, 0];
    while (grid[node.coords.row + offsets[0] + 1][node.coords.col] !== '#') {
      offsets[0]++;
      const southNode = nodes.get(`${node.coords.row + offsets[0]}-${node.coords.col}`);
      if (southNode) {
        node.connectedNodes.push(southNode);
        southNode.connectedNodes.push(node);
        break;
      }
    }

    while (grid[node.coords.row][node.coords.col + offsets[1] + 1] !== '#') {
      offsets[1]++;
      const eastNode = nodes.get(`${node.coords.row}-${node.coords.col + offsets[1]}`);
      if (eastNode) {
        node.connectedNodes.push(eastNode);
        eastNode.connectedNodes.push(node);
        break;
      }
    }
  }
  return;
}

function hasVertPath(row: number, col: number, grid: string[][]): boolean {
  if (row - 1 >= 0 && grid[row - 1][col] !== '#') {
    return true;
  }

  if (row + 1 < grid.length && grid[row + 1][col] !== '#') {
    return true;
  }

  return false;
}

function hasHorizPath(row: number, col: number, grid: string[][]): boolean {
  if (col - 1 >= 0 && grid[row][col - 1] !== '#') {
    return true;
  }

  if (col < grid[0].length && grid[row][col + 1] !== '#') {
    return true;
  }

  return false;
}

function findStart(nodes: Map<string, IMazeNode>): IMazeNode {
  let start: IMazeNode | undefined;
  nodes.forEach((node) => {
    if (node.start) {
      start = node;
    }
  });

  if (start === undefined) {
    throw new Error(`Couldn't find start.`);
  }

  return start;
}

function bruteForce(currentNode: IMazeNode, visitedNodes: IMazeNode[], solutions: IMazeNode[][], bestPaths: Map<string, number>): void {
  if (currentNode.goal) {
    visitedNodes.push(currentNode);
    solutions.push(visitedNodes);
    return
  }

  const remainingNodes = currentNode.connectedNodes.filter((node) => !visitedNodes.includes(node))
  if (remainingNodes.length === 0) {
    return;
  }

  visitedNodes.push(currentNode);
  for (const option of remainingNodes) {
    const existing = bestPaths.get(`${option.coords.row}-${option.coords.col}`);
    const score = scorePath(visitedNodes);
    // adding a buffer to account for different orientations. Slightly too permissive and slow, but ultimately works.
    if (existing && existing < score - 1000) {
      continue;
    }
    bestPaths.set(`${option.coords.row}-${option.coords.col}`, score);
    bruteForce(option, visitedNodes.slice(), solutions, bestPaths);
  }
  return;
}

function scorePath(path: IMazeNode[]): number {
  let cost = 0;
  let horizontalEntry = true;
  for (let idx = 0; idx < path.length - 1; idx++) {
    const currentNode = path[idx];
    const nextNode = path[idx + 1];
    
    const horizontalExit = currentNode.coords.col !== nextNode.coords.col;
    if (horizontalEntry !== horizontalExit) {
      cost += 1000;
    }

    if (horizontalExit) {
      cost += Math.abs(nextNode.coords.col - currentNode.coords.col);
    } else {
      cost += Math.abs(nextNode.coords.row - currentNode.coords.row);
    }

    horizontalEntry = horizontalExit;
  }
  return cost;
}

function updateVisitedTiles(visisted: Set<string>, path: IMazeNode[]) {
  for (let i = 0; i < path.length - 1; i++) {
    const current = path[i];
    const next = path[i + 1];
    let offset = 0;
    if (current.coords.col === next.coords.col) {
      if (current.coords.row > next.coords.row) {
        while (current.coords.row - offset >= next.coords.row) {
          visisted.add(`${current.coords.row - offset}-${current.coords.col}`);
          offset++;
        }
      } else {
        while (current.coords.row + offset <= next.coords.row) {
          visisted.add(`${current.coords.row + offset}-${current.coords.col}`);
          offset++;
        }
      }
    } else {
      if (current.coords.col > next.coords.col) {
        while (current.coords.col - offset >= next.coords.col) {
          visisted.add(`${current.coords.row}-${current.coords.col - offset}`);
          offset++;
        }
      } else {
        while (current.coords.col + offset <= next.coords.col) {
          visisted.add(`${current.coords.row}-${current.coords.col + offset}`);
          offset++;
        }
      }
    }
  }
}
