import { getInputAsLines } from "../../helpers/read-inputs";

type Antinodes = Set<string>;

interface ICoordinate {
  col: number;
  row: number;
}

export function y2024d8p1(): number {
  const grid = getInputAsLines(8).body.map((line) => {
    return line.split('');
  });

  const [antennaMap, nodeMap] = buildAntennas(grid);
  for (const [key, antennaCoords] of antennaMap.entries()) {
    const antinodeIds = locateAntinodes(antennaCoords);
    updateNodeMap(key, antinodeIds, nodeMap);
  }

  return countAntinodes(nodeMap);
}

export function y2024d8p2(): number {
  const grid = getInputAsLines(8).body.map((line) => {
    return line.split('');
  });

  const [antennaMap, nodeMap] = buildAntennas(grid);

  const bounds: ICoordinate = {
    col: grid[0].length -1,
    row: grid.length - 1,
  };

  for (const [key, antennaCoords] of antennaMap.entries()) {
    const antinodeIds = locateAllAntinodes(antennaCoords, bounds);
    updateNodeMap(key, antinodeIds, nodeMap);
  }

  return countAntinodes(nodeMap);
}

function buildAntennas(grid: string[][]): [Map<string, ICoordinate[]>, Map<string, Antinodes>] {
  const antennas = new Map<string, ICoordinate[]>();
  const nodes = new Map<string, Antinodes>();
  
  for (const [row, rowArr] of grid.entries()) {
    for (const [col, char] of rowArr.entries()) {
      nodes.set(`${row}-${col}`, new Set<string>());
      if (char !== '.') {
        const antenna = antennas.get(char) || [];
        antennas.set(char, [...antenna, { row, col }]);
      }
    }
  }

  return [antennas, nodes];
}

function locateAllAntinodes(antennas: ICoordinate[], bounds: ICoordinate): string[] {
  const antinodeIds: string[] = [];
  for (let i = 0; i < antennas.length - 1; i++) {
    for (let j = i + 1; j < antennas.length; j++) {
      const a1 = antennas[i];
      const a2 = antennas[j];

      const coordDifference: ICoordinate = {
        col: a2.col - a1.col,
        row: a2.row - a1.row,
      };

      const a1AdjustedCoord: ICoordinate = { 
        row: a1.row,
        col: a1.col,
      };

      while (inBounds(a1AdjustedCoord, bounds)) {
        antinodeIds.push(`${a1AdjustedCoord.row}-${a1AdjustedCoord.col}`);
        a1AdjustedCoord.col -= coordDifference.col;
        a1AdjustedCoord.row -= coordDifference.row;
      }

      const a2AdjustedCoord: ICoordinate = { 
        row: a2.row,
        col: a2.col,
      };

      while (inBounds(a2AdjustedCoord, bounds)) {
        antinodeIds.push(`${a2AdjustedCoord.row}-${a2AdjustedCoord.col}`);
        a2AdjustedCoord.col += coordDifference.col;
        a2AdjustedCoord.row += coordDifference.row;
      }
    }
  }

  return antinodeIds;
}

function inBounds(currentCoord: ICoordinate, bounds: ICoordinate): boolean {
  return (
    currentCoord.col >= 0 &&
    currentCoord.col <= bounds.col &&
    currentCoord.row >= 0 &&
    currentCoord.col <= bounds.row
  );
}

function locateAntinodes(antennas: ICoordinate[]): string[] {
  const antinodeIds: string[] = [];
  for (let i = 0; i < antennas.length - 1; i++) {
    for (let j = i + 1; j < antennas.length; j++) {
      const a1 = antennas[i];
      const a2 = antennas[j];

      const coordDifference: ICoordinate = {
        col: a2.col - a1.col,
        row: a2.row - a1.row,
      };

      antinodeIds.push(`${a1.row - coordDifference.row}-${a1.col - coordDifference.col}`);
      antinodeIds.push(`${a2.row + coordDifference.row}-${a2.col + coordDifference.col}`);
    }
  }

  return antinodeIds;
}

function updateNodeMap(key: string, antinodeIds: string[], nodes: Map<string, Antinodes>): void {
  for (const id of antinodeIds) {
    const node = nodes.get(id);
    if (node) {
      node.add(key);
    }
  }
}

function countAntinodes(nodes: Map<string, Antinodes>): number {
  let total = 0;
  for (const antinodes of nodes.values()) {
    if (antinodes.size > 0) {
      total += 1;
    }
  }
  return total;
}
