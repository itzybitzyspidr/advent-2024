import { sortBy } from "../../helpers/algorithms";
import { getInputAsChunks } from "../../helpers/read-inputs";

interface ICoordinates {
  row: number;
  col: number;
}

// Approach - For each instruction, look for objects that will be affected by a push.
// For each object that will be affected, look for new objects that will be subsequently affected.
// Only push if no walls detected and no new objects would be added.
// Move all objects 1 space in direction.
export function y2024d15p2(): number {
  const [grid, instructions] = getInputAsChunks(15, { separator: '\n\n'}).body;
  let [entities, robot] = buildEntities(grid);

  const VALID_DIRECTIONS = ['^', 'v', '<', '>'];
  const filteredInstructions = instructions.split('').filter((ch) => {
    return VALID_DIRECTIONS.includes(ch);
  });

  filteredInstructions.forEach((direction) => {
    const affected = new Map<string, string>();
    const hasHitWall = scanForAffectedEntities(robot, entities, affected, direction);

    if (!hasHitWall) {
      updateEntities(entities, affected, direction);
      robot = updateRobot(robot, direction);
    }
  });

  const lines = grid.split('\n');
  const resultGrid = writeResult(lines.length, lines[0].length * 2, entities);
  console.log(resultGrid);
  return scoreBoxes(entities);
}

function buildEntities(grid: string): [Map<string, string>, string] {
  const entityMap = new Map<string, string>();
  let robot = '';
  grid.split('\n').forEach((line, row) => {
    line.split('').forEach((char, col) => {
      if (char === '#') {
        entityMap.set(`${row}-${col * 2}`, char);
        entityMap.set(`${row}-${col * 2 + 1}`, char);
      } else if ( char === 'O') {
        entityMap.set(`${row}-${col * 2}`, '[');
        entityMap.set(`${row}-${col * 2 + 1}`, ']');
      } else if (char === '@') {
        robot = `${row}-${col * 2}`;
        entityMap.set(`${row}-${col * 2}`, char);
      }
    });
  });
  if (robot === '') {
    throw new Error(`Couldn't find robot`);
  }
  return [entityMap, robot];
}

function scanForAffectedEntities(origin: string, entityMap: Map<string, string>, affectedEntities: Map<string, string>, direction: string): boolean {
  const currentEntity = entityMap.get(origin);
  if (!currentEntity) {
    throw new Error(`Scanning from a null entity: ${origin}`);
  }

  affectedEntities.set(origin, currentEntity);
  const [row, col] = origin.split('-');
  const nextCoordString = 
    direction === '^' ? `${+row - 1}-${col}` :
    direction === 'v' ? `${+row + 1}-${col}` :
    direction === '<' ? `${row}-${+col - 1}` : 
    `${row}-${+col + 1}`;
  
  const nextEntity = entityMap.get(nextCoordString);
  if (!nextEntity) {
    return false;
  } else if (nextEntity === '#') {
    return true;
  } else if (nextEntity === '[') {
    const [newRow, newCol] = nextCoordString.split('-');
    if (direction === '^' || direction === 'v') {
      return (
        scanForAffectedEntities(nextCoordString, entityMap, affectedEntities, direction) ||
        scanForAffectedEntities(`${newRow}-${+newCol + 1}`, entityMap, affectedEntities, direction));
    } else {
      return scanForAffectedEntities(nextCoordString, entityMap, affectedEntities, direction);
    }
  } else if (nextEntity === ']') {
    const [newRow, newCol] = nextCoordString.split('-');
    if (direction === '^' || direction === 'v') {
      return (
        scanForAffectedEntities(nextCoordString, entityMap, affectedEntities, direction) ||
        scanForAffectedEntities(`${newRow}-${+newCol - 1}`, entityMap, affectedEntities, direction));
    } else {
      return scanForAffectedEntities(nextCoordString, entityMap, affectedEntities, direction)
    }

  }
  throw new Error(`How did you get here?`);
}

function coordsToString(coords: number[]): string {
  if (coords.length !== 2) {
    throw new Error(`Invalid coordinates provided: ${coords}.`);
  }
  return `${coords[0]}-${coords[1]}`;
}

function stringToCoords(str: string): number[] {
  const valid = str.match(/^[\d]+-[\d]+$/);
  if (!valid) {
    throw new Error(`Coordinate description must be in the format 23-48. Received: ${str}.`);
  }
  return str.split('-').map((ch) => +ch);
}

function updateRobot(robot: string, direction: string): string {
  const [row, col] = stringToCoords(robot);
  if (direction === '^') {
    return coordsToString([row - 1, col]);
  } else  if (direction === 'v') {
    return coordsToString([row + 1, col]);
  } else  if (direction === '<') {
    return coordsToString([row, col - 1]);
  }
  return coordsToString([row, col + 1]);
}

function updateEntities(entities: Map<string, string>, affected: Map<string, string>, direction: string): void {
  const unorderedList: ICoordinates[] = [];
  // This scuffed loop reversed the order of keys.
  for (const key of affected.keys()) {
    const coords = stringToCoords(key);
    unorderedList.push({
      row: coords[0],
      col: coords[1],
    });
  }

  const compareProp = direction === '^' || direction === 'v' ? 'row' : 'col';
  const dir = direction === '^' || direction === '<' ? 'asc' : 'desc';

  const orderedList = sortBy(unorderedList, { compareProp, dir });
  const orderedKeys: string[] = orderedList.map((coords) => {
    return `${coords.row}-${coords.col}`;
  });

  for (const key of orderedKeys) {
    const char = entities.get(key);
    if (!char) {
      throw new Error(`Attempted to process keys of out order: ${key}`);
    }
    const coords = stringToCoords(key);
    if (direction === '^') {
      entities.set(coordsToString([coords[0] - 1, coords[1]]), char);
    } else if (direction === 'v') {
      // console.log(`Set ${coordsToString([coords[0] + 1, coords[1]])} to ${char}.`);
      entities.set(coordsToString([coords[0] + 1, coords[1]]), char);
    } else if (direction === '<') {
      entities.set(coordsToString([coords[0], coords[1] - 1]), char);
    } else {
      entities.set(coordsToString([coords[0], coords[1] + 1]), char);
    }
    entities.delete(key);
  }
}

function writeResult(ROWS: number, COLS: number, entities: Map<string, string>): string {
  let str = '';
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const entity = entities.get(coordsToString([row, col]));
      str += entity || '.';
    }
    str += '\n';
  }
  return str;
}

function scoreBoxes(entities: Map<string, string>): number {
  let total = 0;
  for (const [k, v] of entities.entries()) {
    if (v === '[') {
      const [row, col] = stringToCoords(k);
      total += 100 * row + col
    }
  }
  return total;
}
