import { getInputAsGrid } from "../../helpers/read-inputs";

/**
 * Create Maze - Each tile contains the distance from start
 * For each tile, look for any tiles within 3 spaces that are at least 100 higher.
 * 
 * All T (or closer) can be reached from S by cheating 2 tiles
 *  >> Abs(S.row - T.row) + Abs(S.col - T.col) <= 3
 * ###T###
 * ##T#T#
 * #T###T#
 * T##S##T
 * #T###T#
 * ##T#T##
 * ###T###
 */

interface ICoordinates {
  row: number;
  col: number;
}

interface ITile {
  id: string;
  coords: ICoordinates;
  cost: number;
  start: boolean;
  end: boolean;
  tileType: string;
}

export function y2024d20p1(): number {
  const input = getInputAsGrid(20).body;

  const [gridMap, start, end] = generateGrid(input);
  console.log('Read');
  setCosts(gridMap, start, end);
  console.log('Costs Set');

  let count = 0;
  const cheatMap = new Map<number, number>();
  for (const tile of gridMap.values()) {
    if (tile.cost >= 0) {
      const costs = bruteForceCheatsFromTile(tile, gridMap);
      count += costs.length;
      for (const cost of costs) {
        const old = cheatMap.get(cost) || 0;
        cheatMap.set(cost, old + 1);
      }
    }
  }
  
  console.log(cheatMap);
  return count;
}

export function y2024d20p2(): number {
  const input = getInputAsGrid(20).body;

  const [gridMap, start, end] = generateGrid(input);
  console.log('Input Read...');
  setCosts(gridMap, start, end);
  console.log('Costs Set...');

  let count = 0;
  for (const tile of gridMap.values()) {
    if (tile.cost >= 0) {
      const cheatTargets = getCheatTargetsForTile(tile, gridMap, 100);
      count += cheatTargets.length;
    }
  }

  return count;
}

/**
 * 
 * @param input string representation of the grid. # are walls, . are empty paths, 'S' is start, 'E' is end
 * @returns Map of ITiles, Start Tile, End Tile
 */
function generateGrid(input: string[][]): [Map<string, ITile>, ITile, ITile] {
  const gridMap = new Map<string, ITile>();

  let S: ITile;
  let E: ITile;

  for (const [row, line] of input.entries()) {
    for (const [col, char] of line.entries()) {
      gridMap.set(`${row}-${col}`, {
        id: `${row}-${col}`,
        coords: {
          row,
          col,
        },
        tileType: char,
        cost: -1,
        start: char === 'S',
        end: char === 'E',
      });

      if (char === 'S') {
        S = gridMap.get(`${row}-${col}`)!;
      }

      if (char === 'E') {
        E = gridMap.get(`${row}-${col}`)!;
      }
    }
  }

  return [gridMap, S!, E!];
}

function setCosts(grid: Map<string, ITile>, start: ITile, end: ITile): void {
  let current = start;
  start.cost = 0;
  while (current !== end) {
    const neighbours = getNeighbours(current, grid, 1);
    const [neighbour] = neighbours.filter((n) => n.cost === -1);
    if (!neighbour) {
      throw new Error(`No friends on Sundays.`);
    }

    neighbour.cost = current.cost + 1;
    current = neighbour;
  }

  return;
}

function getNeighbours(current: ITile, grid: Map<string, ITile>, largestDistance: number): ITile[] {
  const [row, col] = [current.coords.row, current.coords.col];
  const prospectiveNeighbours: ITile[] = [];
  for (const tile of grid.values()) {
    if (
      Math.abs(row - tile.coords.row) + Math.abs(col - tile.coords.col) <= largestDistance &&
      tile !== current &&
      tile.tileType !== '#'
    ) {
      prospectiveNeighbours.push(tile);
    }
  }
  return prospectiveNeighbours;
}

// returns all tiles in range of a 2 tile cheat that would save at least n picoseconds.
// Double counting is prevented by ensuring neighbour always costs more than current.
function getCheatTargetsForTile(current: ITile, grid: Map<string, ITile>, pointThreshhold: number): ITile[] {
  const neighbours = getNeighbours(current, grid, 20);

  return neighbours.filter((neighbour) => {
    return (
      neighbour.cost > current.cost &&
      neighbour.cost - current.cost >= (
      pointThreshhold + (
        Math.abs(current.coords.row - neighbour.coords.row) + Math.abs(current.coords.col - neighbour.coords.col)
      )
    ));
  });
}

// Treat each tile as a start for a cheat. IF it IS or HAS an orthogonal usable tile, check each adjacent direction for an orthogonal end that is much larger.
function bruteForceCheatsFromTile(current: ITile, grid: Map<string, ITile>): number[] {
  const orthTiles = getOrthTiles(current, grid);
  const cheats: number[] = [];
  for (const tile of orthTiles) {
    const orthNeighbours = getNeighbours(tile, grid, 1).filter((ot) => ot.cost - current.cost > 100);
    cheats.push(...orthNeighbours.map((ot) => ot.cost - current.cost - 1));
  }
  return cheats;
}

function getOrthTiles(current: ITile, grid: Map<string, ITile>): ITile[] {
  const [row, col] = [current.coords.row, current.coords.col];
  const prospectiveNeighbours: ITile[] = [];
  for (const tile of grid.values()) {
    if (
      Math.abs(row - tile.coords.row) + Math.abs(col - tile.coords.col) <= 1 &&
      tile !== current
    ) {
      prospectiveNeighbours.push(tile);
    }
  }
  return prospectiveNeighbours;
}
