import { getInputAsLines } from "../../helpers/read-inputs";

interface IGuardState {
  row: number;
  col: number;
  facing: string;
}

interface ITile {
  row: number;
  col: number;
  blocked: boolean;
  visited: boolean;
}

export function y2024d6p1(): number {
  const grid = getInputAsLines(6).body.map((line) => line.split(''));

  const [tileMap, guardState] = buildTileMap(grid);
  const guardStateSet = new Set<string>();

  while(!guardStateSet.has(`${guardState.row}-${guardState.col}-${guardState.facing}`)) {
    guardStateSet.add(`${guardState.row}-${guardState.col}-${guardState.facing}`);

    const curTile = tileMap.get(`${guardState.row}-${guardState.col}`);
    if (!curTile) {
      throw new Error(`Guard state invalid ${guardState}`);
    }
    curTile.visited = true;

    if (moveGuard(guardState, tileMap)) {
      return countVisitedTiles(tileMap);
    }
  }

  return countVisitedTiles(tileMap);
}

export function y2024d6p2(): number {
  const grid = getInputAsLines(6).body.map((line) => line.split(''));

  let total = 0;
  for (const [row, rowArr] of grid.entries()) {
    for (const [col, _col] of rowArr.entries()) {
      // console.log(`row: ${row}, col: ${col}`);
      total += isLoop(row, col, grid) ? 1 : 0;
    }
  }
  
  return total;
}

function isLoop(row: number, col: number, grid: string[][]): boolean {
  const [tileMap, guardState] = buildTileMap(grid);
  const guardStateSet = new Set<string>();

  const modifiedTile = tileMap.get(`${row}-${col}`);
  if (!modifiedTile || modifiedTile.blocked || modifiedTile.visited) {
    return false;
  }

  modifiedTile.blocked = true;

  while(!guardStateSet.has(`${guardState.row}-${guardState.col}-${guardState.facing}`)) {
    guardStateSet.add(`${guardState.row}-${guardState.col}-${guardState.facing}`);

    const curTile = tileMap.get(`${guardState.row}-${guardState.col}`);
    if (!curTile) {
      throw new Error(`Guard state invalid ${guardState}`);
    }
    curTile.visited = true;

    if (moveGuard(guardState, tileMap)) {
      return false;
    }
  }
  return true;
}

function buildTileMap(grid: string[][]): [Map<string, ITile>, IGuardState] {
  const tileMap = new Map<string, ITile>();
  let guardState: IGuardState = {
    col: -1,
    row: -1,
    facing: '',
  };

  for (const [row, rowArr] of grid.entries()) {
    for (const [col, char] of rowArr.entries()) {
      tileMap.set(`${row}-${col}`, {
        blocked: char === '#',
        col,
        row,
        visited: char === '^',
      });

      if (char === '^') {
        guardState = {
          col,
          row,
          facing: char,
        };
      }
    }
  }

  if (guardState.row === -1) {
    throw new Error(`Couldn't find guard start position`);
  }

  return [tileMap, guardState];
}

function moveGuard(guard: IGuardState, tileMap: Map<string, ITile>): boolean {
  const rowAdjustment = guard.facing === '^' ? -1 : guard.facing === 'v' ? 1 : 0;
  const colAdjustment = guard.facing === '<' ? -1 : guard.facing === '>' ? 1 : 0;
  const nextTileId = `${guard.row + rowAdjustment}-${guard.col + colAdjustment}`;

  const nextTile = tileMap.get(nextTileId);
  if (!nextTile) {
    return true;
  }
  if (!nextTile || nextTile.blocked) {
    guard.facing = rotateGuard(guard);
  } else {
    guard.col = nextTile.col;
    guard.row = nextTile.row;
  }
  return false;
}

function rotateGuard(guard: IGuardState): string {
  const ROTATION_ORDER = ['^', '>', 'v', '<'];
  return ROTATION_ORDER[(ROTATION_ORDER.findIndex((char) => char === guard.facing) + 1) % ROTATION_ORDER.length];
}

function countVisitedTiles(tileMap: Map<string, ITile>): number {
  let total = 0;
  for (const tile of tileMap.values()) {
    total += tile.visited ? 1 : 0;
  }
  return total;
}
