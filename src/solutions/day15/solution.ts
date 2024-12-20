import { getInputAsChunks } from "../../helpers/read-inputs";

interface IRobot {
  row: number;
  col: number;
}

interface IScanResult {
  distance: number;
  direction: string;
  spaceType: string;
}

export function y2024d15p1(): number {
  const [grid, instructions] = getInputAsChunks(15, { separator: '\n\n'}).body;
  const gridArr = grid.split('\n').map((line) => {
    return line.split('');
  });

  const robot = findRobot(gridArr);

  const VALID_DIRECTIONS = ['^', '<', '>', 'v'];
  for (const direction of instructions.split('').filter((char) => VALID_DIRECTIONS.includes(char))) {
    const scanRes = scanForWallOrSpace(gridArr, robot, direction);

    if (scanRes.spaceType === '.') {
      updateGrid(gridArr, robot, scanRes);
    }
  }

  console.log(gridArr.map((line) => line.join('')));
  return scoreGrid(gridArr);
}

// export function y2024d15p2(): number {
//   const [grid, instructions] = getInputAsChunks(15, { separator: '\n\n'}).body;
//   const wideGrid = convertToWideGrid(grid);
//   console.log(wideGrid.map((line) => line.join('')));

//   return 0;
// }

function findRobot(grid: string[][]): IRobot {
  for (const [row, line] of grid.entries()) {
    for (const [col, char] of line.entries()) {
      if (char === '@') {
        return {
          col,
          row,
        };
      }
    }
  }

  throw new Error(`What robot?`);
}

function scanForWallOrSpace(grid: string[][], robot: IRobot, direction: string): IScanResult {
  let scannedTile = grid[robot.row][robot.col];
  let distance = 0;
  while (scannedTile !== '.' && scannedTile !== '#') {
    distance++;
    if (direction === '^') {
      scannedTile = grid[robot.row - distance][robot.col];
    } else if (direction === 'v') {
      scannedTile = grid[robot.row + distance][robot.col];
    } else if (direction === '<') {
      scannedTile = grid[robot.row][robot.col - distance];
    } else if (direction === '>') {
      scannedTile = grid[robot.row][robot.col + distance];
    } else if (scannedTile === undefined) {
      console.log(grid.map((line) => line.join('')));
      throw new Error(`wut`);
    }
  }

  return {
    distance,
    direction,
    spaceType: scannedTile,
  };
}

function updateGrid(grid: string[][], robot: IRobot, scanResult: IScanResult): void {
  const tmpRobot = { ...robot };
  if (scanResult.direction === '^') {
    robot.row--;
    if (scanResult.distance > 1) {
      grid[robot.row - (scanResult.distance - 1)][robot.col] = 'O';
    }
  } else if (scanResult.direction === 'v') {
    robot.row++;
    if (scanResult.distance > 1) {
      grid[robot.row + (scanResult.distance - 1)][robot.col] = 'O';
    }
  } else if (scanResult.direction === '<') {
    robot.col--;
    if (scanResult.distance > 1) {
      grid[robot.row][robot.col - (scanResult.distance - 1)] = 'O';
    }
  } else if (scanResult.direction === '>') {
    robot.col++;
    if (scanResult.distance > 1) {
      grid[robot.row][robot.col + (scanResult.distance - 1)] = 'O';
    }
  }

  grid[robot.row][robot.col] = '@';
  grid[tmpRobot.row][tmpRobot.col] = '.';
}

function scoreGrid(grid: string[][]): number {
  let total = 0;
  for (const [row, line] of grid.entries()) {
    for (const [col, char] of line.entries()) {
      if (char === 'O') {
        total += 100 * row + col;
      }
    }
  }
  return total;
}

function convertToWideGrid(grid: string): string[][] {
  const wideGrid = grid.split('\n').map((line) => {
    line = line.replace(/#/g, '##');
    line = line.replace(/\./g, '..');
    line = line.replace(/O/g, '[]');
    line = line.replace(/@/g, '@.');
    return line.split('');
  });

  return wideGrid;
}
