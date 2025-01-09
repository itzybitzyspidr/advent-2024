import { createWriteStream, write } from 'node:fs';
import { getInputAsLines } from "../../helpers/read-inputs";

interface ICoordinates {
  row: number;
  col: number;
}

interface IGridTile {
  id: string;
  coords: ICoordinates;
  tileType: string;
  quickest: number;
  start: boolean;
  end: boolean;
}

export function y2024d18p1(p2?: number): number {
  const MIN_LINES = 1024 + (p2 || 0);
  const input = getInputAsLines(18).body.slice(0, MIN_LINES);

  const mappedGrid = generateGrid(input);
  const start = mappedGrid.get(`0-0`);
  const end = mappedGrid.get(`70-70`);

  if (!start || !end) {
    throw new Error(`Couldn't find start or end node.`);
  }

  start.quickest = 0;
  let neighbourSet = new Set<IGridTile>();
  getValidNeighbours(start, mappedGrid, neighbourSet);
  while (end.quickest === 100000) {
    const newSet = new Set<IGridTile>();
    for (const tile of neighbourSet) {
      getValidNeighbours(tile, mappedGrid, newSet);
    }
    neighbourSet = newSet;
    if (p2 && newSet.size === 0) {
      writeGrid(mappedGrid);
      return p2;
    }
  }

  if (!p2) {
    return end.quickest;
  }
  return y2024d18p1(p2 + 1);
}

export function y2024d18p2(): string {
  const line = y2024d18p1(1);
  const input = getInputAsLines(18).body;
  return input[1024 + line - 1];
}

function generateGrid(input: string[]): Map<string, IGridTile> {
  const HEIGHT = 71;
  const WIDTH = 71;
  const gridMap = new Map<string, IGridTile>();

  for (let row = 0; row < HEIGHT; row++) {
    for (let col = 0; col < WIDTH; col++) {
      gridMap.set(`${row}-${col}`, {
        id: `${row}-${col}`,
        coords: {
          row,
          col,
        },
        tileType: '.',
        quickest: 100000,
        start: col === 0 && row === 0,
        end: col === HEIGHT - 1 && row === HEIGHT - 1,
      });
    }
  }

  for (const line of input) {
    const [row, col] = line.split(',').map((v) => +v);
    const tile = gridMap.get(`${row}-${col}`);
    if (!tile) {
      throw new Error(`Something cooked when generating grid.`);
    }
    tile.tileType = '#';
  }

  return gridMap;
}

async function writeGrid(gridMap: Map<string, IGridTile>): Promise<void> {
  const HEIGHT = 71;
  const WIDTH = 71;

  const resArr: number[][] = [];
  for (let row = 0; row < HEIGHT; row++) {
    resArr.push(new Array<number>(WIDTH).fill(-1));
  }

  for (const tile of gridMap.values()) {
    resArr[tile.coords.row][tile.coords.col] = tile.quickest;
  }

  const f = createWriteStream(`./src/outputs/day18/grid.txt`);
    for (const line of resArr) {
      for (const char of line) {
        f.write(char.toString() + ',');
      }
      f.write('\n');
    }
  
    f.end();
    await new Promise(resolve => f.on("close", resolve));
    return;
}

function getValidNeighbours(tile: IGridTile, grid: Map<string, IGridTile>, queue: Set<IGridTile>): void {
  const u = grid.get(`${tile.coords.row - 1}-${tile.coords.col}`);
  const d = grid.get(`${tile.coords.row + 1}-${tile.coords.col}`);
  const l = grid.get(`${tile.coords.row}-${tile.coords.col - 1}`);
  const r = grid.get(`${tile.coords.row}-${tile.coords.col + 1}`);

  for (const neighbour of [l, r, u, d]) {
    if (neighbour && !queue.has(neighbour) && neighbour.tileType === '.' && neighbour.quickest > tile.quickest) {
      neighbour.quickest = tile.quickest + 1;
      queue.add(neighbour);
    }
  }

  return;
}
