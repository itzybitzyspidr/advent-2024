import { getInputAsGrid } from "../../helpers/read-inputs";

interface ICoordinate {
  row: number;
  col: number;
}

interface IMazeTile {
  coords: ICoordinate;
  tileType: string;
}

interface IReindeerState {
  tile: IMazeTile;
  facing: string;
  cost: number;
}

export function y2024d16p1(): number {
  const input  = getInputAsGrid(16).body;
  const maze = buildMaze(input);

  const reindeerState = findReindeer(maze);
  // Format for state: row-col-facing
  const bestStates = new Map<string, number>();
  bestStates.set(stateToString(reindeerState), 0);

  const unexploredStates: IReindeerState[] = [reindeerState];

  while (unexploredStates.length) {
    try {
      const currentState = unexploredStates.pop();
      if (!currentState) {
        console.log(`==== UNEXPLORED STATES ====`);
        console.log(unexploredStates);
        throw new Error(`Attempting to explore null state!`);
      }
  
      const possibleValidStates = findValidNextStates(currentState, maze);
      for (const possibleState of possibleValidStates) {
        const existingState = bestStates.get(stateToString(possibleState));
        if (!existingState || existingState > possibleState.cost) {
          bestStates.set(stateToString(possibleState), possibleState.cost);
          // todo - this is brute force
          unexploredStates.push(possibleState);
        }
      }
    } catch (e) {
      console.log(bestStates);
      throw e;
    }
  }

  const exitStates = findExitStates(maze, bestStates);
  console.log(exitStates);
  return Math.min(...exitStates);
}

function buildMaze(grid: string[][]): Map<string, IMazeTile> {
  const maze = new Map<string, IMazeTile>();
  grid.forEach((line, row) => {
    line.forEach((char, col) => {
      maze.set(`${row}-${col}`, {
        coords: {
          row,
          col,
        },
        tileType: char,
      });
    });
  });

  return maze;
}

function findReindeer(maze: Map<string, IMazeTile>): IReindeerState {
  for (const tile of maze.values()) {
    if (tile.tileType === 'S') {
      return {
        cost: 0,
        facing: 'east',
        tile,
      }
    }
  }
  throw new Error(`Couldn't find reindeer.`);
}

function findExitStates(maze: Map<string, IMazeTile>, states: Map<string, number>): number[] {
  const res: number[] = [];
  for (const tile of maze.values()) {
    if (tile.tileType === 'E') {
      console.log(tile);
      for (const facing of ['north', 'east', 'south', 'west']) {
        const bestState = states.get(`${tile.coords.row}-${tile.coords.col}-${facing}`);
        if (bestState) {
          res.push(bestState);
        }
      }
    }
  }

  return res;
}

function stateToString(state: IReindeerState): string {
  return `${state.tile.coords.row}-${state.tile.coords.col}-${state.facing}`;
}

function findValidNextStates(state: IReindeerState, map: Map<string, IMazeTile>): IReindeerState[] {
  const FACINGS = ['north', 'east', 'south', 'west'];
  const currentFacingIndex = FACINGS.findIndex((v) => v === state.facing);
  const nextStraightCoord = getNextStraightCoord(state);
  const nextStraightTile = map.get(`${nextStraightCoord.row}-${nextStraightCoord.col}`);

  if (!nextStraightTile) {
    throw new Error(`Next tile out of bounds. Coords: ${nextStraightCoord.row}-${nextStraightCoord.col}`);
  }

  const validStates: IReindeerState[] = [];
  if (nextStraightTile.tileType !== '#') {
    validStates.push({
      cost: state.cost + 1,
      facing: state.facing,
      tile: nextStraightTile,
    });
  }

  validStates.push({
    cost: state.cost + 1000,
    facing: FACINGS[(currentFacingIndex + 1) % 4],
    tile: state.tile,
  },
  {
    cost: state.cost + 1000,
    facing: FACINGS[(currentFacingIndex + 3) % 4],
    tile: state.tile,
  })

  return validStates;
}

function getNextStraightCoord(state: IReindeerState): ICoordinate {
  const coords = {
    row: state.tile.coords.row,
    col: state.tile.coords.col,
  };

  if (state.facing === 'east') {
    coords.col++;
  } else if (state.facing === 'west') {
    coords.col--;
  } else if (state.facing === 'north') {
    coords.row--;
  } else if (state.facing === 'south') {
    coords.row++;
  } else {
    console.log(state);
    throw new Error(`Invalid facting for state!`);
  }
  return coords;
}
